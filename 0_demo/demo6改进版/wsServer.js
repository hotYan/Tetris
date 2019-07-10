
var express = require('express');
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var redis = require('socket.io-redis');
if(process.env.REDIS_URL){
    console.log('install socket.io-redis adapter');
    io.adapter(redis(process.env.REDIS_URL, {})); 
}
var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
  });

app.use(express.static(__dirname + '/public'));


var clientCount=0;
io.on("connection",function(socket){
    clientCount++;
    socket.nickname='user'+clientCount;
    io.emit("enter",socket.nickname + " come in ");

    socket.on("message",function(str){
        io.emit('message',socket.nickname + "says: "+str);
    });
    socket.on("disconnect",function(){
        io.emit('leave',socket.nickname + "left ");
    });
});