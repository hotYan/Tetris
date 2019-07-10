var Local = function (socket) {
    var game;//游戏对象
    var INTERVAL = 200;
    var timer = null;
    var timeCount = 0;
    var time = 0;

    var start = function () {//开始
        var doms = {
            gameDiv: document.getElementById('local_game'),
            nextDiv: document.getElementById('local_next'),
            timeDiv: document.getElementById('local_time'),
            scoreDiv: document.getElementById('local_score'),
            resultDiv:document.getElementById('local_gameover')
        }
        game = new Game();

        var type = generateType();
        var dir = generateDir();
        game.init(doms,type ,dir );//我的游戏区动作
        socket.emit('init',{type:type,dir:dir});
        bindKeyEvent();

        var t = generateType();
        var d = generateDir(); 
        game.performNext(t,d);
        socket.emit('next',{type:t,dir:d});
        timer = setInterval(move, INTERVAL);
    }
    var stop = function () {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        document.onkeydown = null;
    }

    var move = function () {//下落
        timeFunc();
        if (!game.down()) {
            game.fixed();
            socket.emit('fixed');
            var line = game.checkClear();
            if (line) {
                game.addScore(line);
                socket.emit('line',line);
                if(line > 1){
                    var bottomLines = generataBottomLine(line);
                    socket.emit('bottomLine',bottomLines);
                }
            }
            var gameOver = game.checkGameOver();
            if (gameOver) {
                game.gameover(false);
                document.getElementById('remote_gameover').innerHTML = '成功';
                socket.emit('lose');
                stop();
            } else {
                var t = generateType();
                var d = generateDir(); 
                game.performNext(t,d);
                socket.emit('next',{type:t,dir:d});  
            }
        }else{
            socket.emit('down');
        }
    }
    
    var timeFunc = function () {//计时函数
        timeCount = timeCount + 1;
        if (timeCount == 5) {
            timeCount = 0;
            time = time + 1;
            game.setTime(time);
            socket.emit('time',time);
        }
    }
    var generateType = function () {//随机方块
        return Math.ceil(Math.random() * 7) - 1;
    }
    var generateDir = function () {//随机旋转次数
        return Math.ceil(Math.random() * 4) - 1;
    }
    var bindKeyEvent = function () {//绑定键盘事件
        document.onkeydown = function (e) {
            if (e.keyCode == 38) {//up
                game.rotate();
                socket.emit('rotate');
            } else if (e.keyCode == 39) {//right
                game.right();
                socket.emit('right');
            } else if (e.keyCode == 40) {//down
                game.down();
                socket.emit('down');
            } else if (e.keyCode == 37) {//left
                game.left();
                socket.emit('left');
            } else if (e.keyCode == 32) {//space
                game.fall();
                socket.emit('fall');
            }

        }
    }
    var generataBottomLine = function(lineNum){
        var lines =[];
        for(var i=0;i<lineNum;i++){
            var line =[];
            for(var j=0;j<10;j++){
                line.push(Math.ceil(Math.random()*2)-1);
            }
            lines.push(line);
        }
        return lines;
    }
    
    socket.on('start',function(){
        document.getElementById('waiting').innerHTML = '';
        start();
    });
    socket.on('lose',function(){
        game.gameover(true);
        stop();
    });
    socket.on('leave',function(){
        document.getElementById('local_gameover').innerHTML = '对方掉线';
        document.getElementById('remote_gameover').innerHTML = '已掉线';
        stop();
    });
    socket.on('bottomLines',function(data){
        game.addTaiLines(data);
        socket.emit('addTaiLines',data);
    });

}