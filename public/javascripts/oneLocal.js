// 我的游戏区域
var Local = function () {
    var game;//游戏对象
    var time = 0;
    var speed = 1;

    var timer = null;//计时定时器
    var INTERVAL_1 = 1000;//时间间隔
    var INTERVAL_2 = 700;//时间间隔
    var INTERVAL_3 = 400;//时间间隔
    var INTERVAL_4 = 200;//时间间隔
    var changeTime1 = 30;
    var changeTime2 = 60;
    var changeTime3 = 90;

    const SIZE = 33;
    var speedTime = null;//下落速度定时器
    var speedTime_1 = null;//下落速度定时器
    var speedTime_2 = null;//下落速度定时器
    var speedTime_3 = null;//下落速度定时器


    //绑定键盘事件
    var bindKeyEvent = function () {
        document.onkeydown = function (e) {
            if (e.keyCode == 38 || e.keyCode == 87) {//up
                game.rotate();
            } else if (e.keyCode == 39 || e.keyCode == 68) {//right
                game.right();
            } else if (e.keyCode == 40 || e.keyCode == 83) {//down
                game.down();
            } else if (e.keyCode == 37 || e.keyCode == 65) {//left
                game.left();
            } else if (e.keyCode == 32) {//space
                game.fall();
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
    }


    //游戏结束，清空定时器、计时器，键盘事件
    var over = function () {
        stop();
        time = 0; //将时间清0
    }
    //生成随机方块
    var generateType = function () {
        return Math.ceil(Math.random() * 7) - 1;//0-7
    }
    //生成随机方块的随机形状
    var generateDir = function () {
        return Math.ceil(Math.random() * 4) - 1;//0-3
    }
    //控制方块下落
    var move = function () {
        if (!game.down()) {//不能下降时
            game.fixed();//变色
            var line = game.checkClear();//消行
            if (line) {
                game.addLine(line);//显示行
                game.addScore(line);//显示分数
            }
            var gameOver = game.checkGameOver();
            if (gameOver) {//满足停止游戏条件
                game.over();//提示游戏结束
                over();//游戏结束
            } else {
                game.performNext(generateType(), generateDir());//生成下一个方块
            }
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
        if (time == changeTime1) {//第2分钟
            changeSpeed();//设置速度
            clearSpeed(speedTime);//清除之前的定时器
            speedTime_1 = setInterval(move, INTERVAL_2);//定时器，下落速度

        } else if (time == changeTime2) {//第3分钟
            changeSpeed();//设置速度
            clearSpeed(speedTime_1);//清除之前的定时器
            speedTime_2 = setInterval(move, INTERVAL_3);//定时器，下落速度
        } else if (time == changeTime3) {//第4分钟
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
    // 开始
    var render = function () {
        var doms = {
            gameDiv: document.getElementById('local_game'),
            nextDiv: document.getElementById('local_next'),
            resultDiv: document.getElementById('local_gameover'),
            scoreDiv: document.getElementById('local_score'),
            lineDiv: document.getElementById('local_line'),
            timeDiv: document.getElementById('local_time'),
            speedDiv: document.getElementById('local_speed')
        }
        game = new Game();
        var type = generateType();
        var dir = generateDir();
        game.init(doms, type, dir, SIZE);
        bindKeyEvent();
        game.performNext(type, dir);
        setTime();
    }

    //重新开始
    // var reStart = function () {
    //     reload();
    // }

    var resetSpeed = function (time) {
        if (time > 0 && time < changeTime1) {//第1分钟
            speedTime = setInterval(move, INTERVAL_1);//定时器，下落速度
        } else if (time >= changeTime1 && time < changeTime2) {//第2分钟
            speedTime_1 = setInterval(move, INTERVAL_2);//定时器，下落速度
        } else if (time >= changeTime2 && time < changeTime3) {//第3分钟
            speedTime_2 = setInterval(move, INTERVAL_3);//定时器，下落速度
        } else if (time >= changeTime3) {//第4分钟
            speedTime_3 = setInterval(move, INTERVAL_4);//定时器，下落速度
        }
    }
    //暂停
    // var pause = function (time) {
    var pause = document.getElementById('stop');
    var onPause = false;//没有暂停
    pause.onclick = function () {
        if (onPause) {//暂停结束
            pause.style.backgroundImage = "url(../images/stop.png)";//变为开始按钮
            bindKeyEvent();
            resetSpeed(time);
            setTime();

        } else {//暂停
            pause.style.backgroundImage = "url(../images/start.png)";//变为开始按钮
            stop();//暂停游戏 
        }
        onPause = !onPause; //每点击一次，改变状态
    }
    //music
    
    // 开始
    var start = function () {
        render();
        speedTime = setInterval(move, 1000);//定时器，下落速度  
    }
    // this.reStart = reStart;
    this.start = start;//计时
    // this.pause = pause;
}