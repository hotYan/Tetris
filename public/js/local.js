// 我的游戏区域
var Local = function (socket) {
    var game;
    var timer = null;
    const SIZE = 33;
    const INTERVAL = 800;

    //绑定键盘事件
    var bindKeyEvent = function () {
        document.onkeydown = function (e) {
            if (e.keyCode == 38) {//up
                game.rotate();
                socket.emit('rotate');//给socket发送rotate消息
            } else if (e.keyCode == 39) {//right
                game.right();
                socket.emit('right');//给socket发送right消息
            } else if (e.keyCode == 40) {//down
                game.down();
                socket.emit('down');//给socket发送down消息
            } else if (e.keyCode == 37) {//left
                game.left();
                socket.emit('left');//给socket发送left消息
            } else if (e.keyCode == 32) {//space
                game.fall();
                socket.emit('fall');//给socket发送fall消息
            }
        }
    }
    //生成随机方块
    var generateType = function () {
        return Math.ceil(Math.random() * 7) - 1;
    }
    //生成随机方块的随机形状
    var generateDir = function () {
        return Math.ceil(Math.random() * 4) - 1;
    }
    //结束游戏，清空定时器、键盘事件
    var stop = function () {
        if (timer) {//清空定时器
            clearInterval(timer);
            timer = null;
        }
        document.onkeydown = null;//清空键盘事件
    }
    //自动下落，到底变色，生成下一个方块，消行
    var move = function () {
        if (!game.down()) {//不能下降时
            game.fixed();//变色
            socket.emit('fixed');//给socket发送fixed消息
            var line = game.checkClear();//消行
            if (line) {
                socket.emit('line', line);
                if(line>1){//至少消3行
                    var addLines = generateBlock(line);
                    socket.emit('addLines',addLines);
                }
            }
            var gameOver = game.checkGameOver();
            if (gameOver) {//满足停止游戏条件
                game.gameOver(false);
                document.getElementById('remote_gameover').innerHTML = '成 功！'
                socket.emit('lose');
                stop();//停止游戏
            } else {
                // game.performNext(generateType(), generateDir());//生成下一个方块
                var t = generateType();
                var d = generateDir();
                game.performNext(t, d);
                socket.emit('next', { type: t, dir: d });
            }
        } else {
            socket.emit('down');//给socket发送down消息
        }
    }
    //随机生成障碍
    var generateBlock = function (lineNum) {
        var lines = [];
        for (var i = 0; i < lineNum; i++) {
            var line = [];
            for (var j = 0; j < 10; j++) {
                line.push(Math.ceil(Math.random() * 2) - 1);//随机生成
            }
            lines.push(line);
        }
        return lines;
    }
    var start = function () {
        var doms = {
            gameDiv: document.getElementById('local_game'),
            nextDiv: document.getElementById('local_next'),
            resultDiv: document.getElementById('local_gameover'),

        }
        game = new Game();

        var type = generateType();
        var dir = generateDir();
        game.init(doms, type, dir, SIZE);
        socket.emit('init', { type: type, dir: dir });//给socket发init消息

        bindKeyEvent();
        // game.performNext(generateType(), generateDir());
        var t = generateType();
        var d = generateDir();
        game.performNext(t, d);
        socket.emit('next', { type: t, dir: d });
        timer = setInterval(move, INTERVAL);
    }

    socket.on('start', function () {
        document.getElementById('waiting').innerHTML = '';
        start();
    });
    socket.on('lose', function () { //接收到对方发的lose消息
        game.gameOver(true);        //显示我方成功
        stop();
    });
    socket.on('leave', function () {//接收到对方发的leave消息即对方掉线
        document.getElementById('local_gameover').innerHTML = '对 方 掉 线！';
        document.getElementById('remote_gameover').innerHTML = '已 掉 线！';
        stop();
    });
    socket.on('addLines', function (data) {
        game.addBlock(data);
        socket.emit('addBlock',data);
    });

}