var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('socket.io-redis');
if (process.env.REDIS_URL) {
    console.log('install socket.io-redis adapter');
    io.adapter(redis(process.env.REDIS_URL, {}));
}
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

//客户端计数
var clientCount = 0;
//用来存储客户端socket
var socketMap = {};
var bindListener = function (socket, event) {
    socket.on(event, function (data) {
        if (socket.clientNum % 2 == 0 ){ 
            if(socketMap[socket.clientNum - 1]) {
                socketMap[socket.clientNum - 1].emit(event, data);
            }
        }else{
            if (socketMap[socket.clientNum + 1]) {
                socketMap[socket.clientNum + 1].emit(event, data);
            }
        } 
    });
}
io.on('connection', function (socket) {
    clientCount = clientCount + 1;
    socket.clientNum = clientCount;
    socketMap[clientCount] = socket;
    if (clientCount % 2 == 1) {
        socket.emit('waiting', 'waiting for another person');
    } else{
        if(socketMap[(clientCount - 1)]) {
            socket.emit('start');
            socketMap[(clientCount - 1)].emit('start');
        }else{
            socket,emit('leave');
        }
    }
     
    bindListener(socket, 'init');
    bindListener(socket, 'next');
    bindListener(socket, 'left');
    bindListener(socket, 'right');
    bindListener(socket, 'down');
    bindListener(socket, 'rotate');
    bindListener(socket, 'fixed');
    bindListener(socket, 'line');//消行
    bindListener(socket, 'fall');//下落
    bindListener(socket, 'time');//
    bindListener(socket, 'lose');//
    bindListener(socket, 'bottomLines');//
    bindListener(socket, 'addTaiLines');//


    socket.on('disconnect', function () {
        if (socket.clientNum % 2 == 0 ){ 
            if(socketMap[socket.clientNum - 1]) {
                socketMap[socket.clientNum - 1].emit('leave');
            }
        }else{
            if (socketMap[socket.clientNum + 1]) {
                socketMap[socket.clientNum + 1].emit('leave');
            }
        } 
        delete (socketMap[socket.clientNum]);
    });
});