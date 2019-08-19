// 我的游戏区域
var Local = function (socket) {
    var game;//游戏对象
    const SIZE = 33;
    var time = 0;
    var speed = 1;
    var timer = null;//计时定时器
    var INTERVAL_1 = 1000;//时间间隔
    var INTERVAL_2 = 800;//时间间隔
    var INTERVAL_3 = 600;//时间间隔
    var INTERVAL_4 = 400;//时间间隔
    var speedTime = null;//下落速度定时器
    var speedTime_1 = null;//下落速度定时器
    var speedTime_2 = null;//下落速度定时器
    var speedTime_3 = null;//下落速度定时器
    var restart = document.getElementById('restart');

    //绑定键盘事件
    var bindKeyEvent = function () {
        document.onkeydown = function (e) {
            if (e.keyCode == 38 || e.keyCode == 87) {//up
                game.rotate();
                socket.emit('rotate');//给socket发送rotate消息
            } else if (e.keyCode == 39 || e.keyCode == 68) {//right
                game.right();
                socket.emit('right');//给socket发送right消息
            } else if (e.keyCode == 40 || e.keyCode == 83) {//down
                game.down();
                socket.emit('down');//给socket发送down消息
            } else if (e.keyCode == 37 || e.keyCode == 65) {//left
                game.left();
                socket.emit('left');//给socket发送left消息
            } else if (e.keyCode == 32) {//space
                game.fall();
                socket.emit('fall');//给socket发送fall消息
            }
        }
    }
    //暂停游戏，清空定时器、键盘事件
    var stop = function () {
        if (speedTime) {//清空定时器
            clearInterval(speedTime);
            speedTime = null;
        }
        if (speedTime_1) {//清空定时器
            clearInterval(speedTime_1);
            speedTime_1 = null;
        }
        if (speedTime_2) {//清空定时器
            clearInterval(speedTime_2);
            speedTime_2 = null;
        }
        if (speedTime_3) {//清空定时器
            clearInterval(speedTime_3);
            speedTime_3 = null;
        }
        if (timer) {//清空定时器
            clearInterval(timer);
            timer = null;
        }
        document.onkeydown = null;//清空键盘事件
        restart.disabled = false;
    }
    //游戏结束，清空定时器、计时器，键盘事件
    var over = function () {
        stop();
        time = 0; //将时间清0
        speed = 1;
    }
    //生成随机方块
    var generateType = function () {
        return Math.ceil(Math.random() * 7) - 1;
    }
    //生成随机方块的随机形状
    var generateDir = function () {
        return Math.ceil(Math.random() * 4) - 1;
    }

    //自动下落，到底变色，生成下一个方块，消行
    var move = function () {
        if (!game.down()) {//不能下降时
            game.fixed();//变色
            socket.emit('fixed');//给socket发送fixed消息
            var line = game.checkClear();//消行
            if (line) {
                socket.emit('line', line);
                if (line > 1) {//至少消3行
                    var addLines = generateBlock(line);
                    socket.emit('addLines', addLines);
                }
            }
            var gameOver = game.checkGameOver();
            if (gameOver) {//满足停止游戏条件
                game.gameOver(false);
                document.getElementById('remote_gameover').value = '成功!'
                socket.emit('lose');
                over();//游戏结束
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
    var changeSpeed = function () {
        speed = speed + 1;
        game.showSpeed(speed);
    }
    var clearSpeed = function (clear) {
        if (clear) {//清空定时器
            clearInterval(clear);
            clear = null;
        }
    }
    //计时函数
    var setSpeed = function (time) {
        if (time == 60) {//第2分钟
            changeSpeed();//设置速度
            clearSpeed(speedTime);//清除之前的定时器
            speedTime_1 = setInterval(move, INTERVAL_2);//定时器，下落速度

        } else if (time == 120) {//第3分钟
            changeSpeed();//设置速度
            clearSpeed(speedTime_1);//清除之前的定时器
            speedTime_2 = setInterval(move, INTERVAL_3);//定时器，下落速度
        } else if (time == 180) {//第4分钟
            changeSpeed();//设置速度
            clearSpeed(speedTime_2);//清除之前的定时器
            speedTime_3 = setInterval(move, INTERVAL_4);//定时器，下落速度
        }
    }

    var setTime = function () {
        timer = setInterval(function () {
            time = time + 1;
            game.showTime(time);//显示时间
            setSpeed(time);//改变下落速度
        }, 1000);//计时 
    }
    //随机生成障碍行
    var generateBlock = function (lineNum) {
        var lines = [];
        for (var i = 0; i < lineNum; i++) {
            var line = [];
            for (var j = 0; j < 10; j++) {
                line.push(Math.ceil(Math.random() * 2) - 1);//随机生成0\1
            }
            lines.push(line);
        }
        return lines;
    }
    // 开始
    var render = function () {
        var doms = {
            gameDiv: document.getElementById('local_game'),
            nextDiv: document.getElementById('local_next'),
            resultDiv: document.getElementById('local_gameover'),
            timeDiv: document.getElementById('local_time'),
            speedDiv: document.getElementById('local_speed')

        }
        game = new Game();

        var type = generateType();
        var dir = generateDir();
        game.init(doms, type, dir, SIZE);
        socket.emit('init', { type: type, dir: dir });//给socket发init消息

        bindKeyEvent();
        game.performNext(type, dir);
        socket.emit('next', { type: type, dir: dir });
        setTime();
    }
    var start = function () {
        render();
        restart.disabled = true;
        speedTime = setInterval(move, INTERVAL_1);//定时器，下落速度  
    }

    socket.on('start', function () {//监听start
        document.getElementById('waiting').innerHTML = '';
        start();
        

    });
    socket.on('lose', function () { //监听到对方发的lose消息
        game.gameOver(true);        //显示我方成功
        stop();
    });

    socket.on('leave', function () {//监听接收到对方发的leave消息即对方掉线
        console.log('接受到leave');
        over();
        document.getElementById('local_gameover').value = '成功!';//对 方 掉 线！
        document.getElementById('remote_gameover').innerHTML = '失败!';//已 掉 线！
        // stop();
        

    });
    socket.on('addLines', function (data) {
        game.addBlock(data);
        socket.emit('addBlock', data);
    });

    socket.on('one', function (data) {
        document.getElementById('local_ID').value = data;
        socket.emit('oneRemote', data);
    });
    socket.on('two', function (data) {
        document.getElementById('local_ID').value = data;
        socket.emit('twoRemote', data); 
    });


}