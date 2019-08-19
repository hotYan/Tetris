// var socket = io.connect('http://localhost:3000/gameTwo');
var socket = io.connect();
var local = new Local(socket);
var remote = new Remote(socket);
socket.on('waiting',function(str){
    document.getElementById('waiting').innerHTML = str;
});
