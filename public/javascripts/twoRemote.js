// 对方界面的我方游戏区域
var Remote = function (socket) {
    var game;
    const SIZE = 20;
    var bindEvents = function () {
        socket.on('init', function (data) {//监听init
            start(data.type, data.dir);//
        });
        socket.on('next', function (data) {//监听next
            game.performNext(data.type, data.dir);//
        });
        socket.on('down', function () {//监听down
            game.down();//
        });
        socket.on('rotate', function () {//监听rotate
            game.rotate();//
        });
        socket.on('left', function () {//监听left
            game.left();//
        });
        socket.on('right', function () {//监听right
            game.right();//
        });
        socket.on('fall', function () {//监听fall
            game.fall();//
        });
        socket.on('fixed', function () {//监听fixed
            game.fixed();//
        });
        socket.on('line', function () {//监听line
            game.checkClear();//
        });
        socket.on('lose', function () {//监听lose
            game.gameOver(false);//
        });
        socket.on('addBlock', function (data) {//监听addBlock
            game.addBlock(data);
        });
        
        socket.on('oneRemote', function (data) {//监听addBlock
            document.getElementById('remote_ID').value = data;
            
        });
        socket.on('twoRemote', function (data) {//监听addBlock
            document.getElementById('remote_ID').value = data;
            
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