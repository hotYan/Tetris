// 对方游戏区域
var Remote = function (socket) {
    var game;
    const SIZE = 20;
    var bindEvents = function () {
        socket.on('init', function (data) {
            start(data.type, data.dir);//
        });
        socket.on('next', function (data) {
            game.performNext(data.type, data.dir);//
        });
        socket.on('down', function () {
            game.down();//
        });
        socket.on('rotate', function () {
            game.rotate();//
        });
        socket.on('left', function () {
            game.left();//
        });
        socket.on('right', function () {
            game.right();//
        });
        socket.on('fall', function () {
            game.fall();//
        });
        socket.on('fixed', function () {
            game.fixed();//
        });
        socket.on('line', function () {
            game.checkClear();//
        });
        socket.on('lose', function () {
            game.gameOver(false);//
        });
        socket.on('addBlock', function (data) {
            game.addBlock(data);
        });

        

    }
    var start = function (type, dir) {
        var doms = {
            gameDiv: document.getElementById('remote_game'),
            nextDiv: document.getElementById('remote_next'),
            resultDiv: document.getElementById('remote_gameover')

        }
        game = new Game();
        game.init(doms, type,dir,SIZE);
    }
    bindEvents();
}