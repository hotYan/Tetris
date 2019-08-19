var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = 3000;
server.listen(port,function(){
    console.log('Server listening at port: '+ port);
});
// Routing
app.use(express.static(__dirname + '/public'));

var clientCount = 0;//客户端计数
var socketMap = {};//用来存储客户端socket

var bindListener = function(socket,event){
    socket.on(event, function (data) {//socket接收到init消息
        if (socket.clientNum % 2 == 0 ){
            if(socketMap[(socket.clientNum - 1)]) {//判断用户数量，偶数个，将init消息转发给前一个用户发
                socketMap[(socket.clientNum - 1)].emit(event, data);
            } 
        }else{//奇数个，将init消息转发给下一个用户发
            if(socketMap[(socket.clientNum + 1)]){
                socketMap[(socket.clientNum + 1)].emit(event, data);
            }
        } 
    });
    
}
io.on('connection', function (socket) {
    clientCount = clientCount + 1;      //新用户连接上
    socket.clientNum = clientCount;     //存入socket
    socketMap[clientCount] = socket;    //{clientCount:socket}
    if (clientCount % 2 == 1) {         //只有一个用户，提示等待
        socket.emit('waiting', 'waiting for another person!');//请等待
    } else {
        if(socketMap[(clientCount - 1)]){
            socket.emit('start');       //偶数个用户，开始游戏
            socketMap[(clientCount - 1)].emit('start');
        }else{
            socket.emit('leave');
        } 
    }
    bindListener(socket,'init');
    bindListener(socket,'next');
    bindListener(socket,'down');
    bindListener(socket,'left');
    bindListener(socket,'right');
    bindListener(socket,'rotate');
    bindListener(socket,'fixed');
    bindListener(socket,'fall');
    bindListener(socket,'line');
    bindListener(socket,'lose');
    bindListener(socket,'addLines');
    bindListener(socket,'addBlock');

    socket.on('disconnect', function () {
        if (socket.clientNum % 2 == 0 ){
            if(socketMap[(socket.clientNum - 1)]) {
                socketMap[(socket.clientNum - 1)].emit('leave');
            } 
        }else {
            if(socketMap[(socket.clientNum + 1)]){
                socketMap[(socket.clientNum + 1)].emit('leave');
            }
        }
        delete(socketMap[socket.clientNum]);
    });
});
