var server = require("http").createServer();
var io = require("socket.io")(server);
var PORT = 3000;
var clientCount=0;
server.listen(PORT);
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
})
console.log("websocket server listening on port:" + PORT);