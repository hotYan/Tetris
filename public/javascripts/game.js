// 俄罗斯方块核心代码
var Game = function () {
    var gameData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    var score = 0;
    var allLine = 0;

    //dom元素
    var gameDiv,nextDiv,resultDiv,scoreDiv,lineDiv,timeDiv,speedDiv;
    //divs
    var gameDivs = [];
    var nextDivs = [];
    var cur,next;
    const NEXTSIZE = 20;
    const BIGSIZE = 'big';
    const SMALLSIZE = 'small';
    // 初始化DIV
    var initDiv = function (container, data, divs, squarSize, size) {//初始化gameData
        for (var i = 0; i < data.length; i++) {
            var div = [];
            for (var j = 0; j < data[0].length; j++) {
                var newNode = document.createElement('div');
                newNode.className = squarSize + '_none';
                newNode.style.top = (i * size) + 'px';
                newNode.style.left = (j * size) + 'px';
                container.appendChild(newNode);
                div.push(newNode);
            }
            divs.push(div);
        }
    }
    // 刷新DIV
    var refreshDiv = function (data, divs, squarSize) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] == 0) {
                    divs[i][j].className = squarSize + '_none';//初始化方块
                } else if (data[i][j] == 11 || data[i][j] == 12) {
                    divs[i][j].className = squarSize + '_current_1';//玫红色
                } else if (data[i][j] == 21 || data[i][j] == 22) {
                    divs[i][j].className = squarSize + '_current_2';//黄色
                } else if (data[i][j] == 31 || data[i][j] == 32) {
                    divs[i][j].className = squarSize + '_current_3';//橙色
                } else if (data[i][j] == 41 || data[i][j] == 42) {
                    divs[i][j].className = squarSize + '_current_4';//深蓝色
                } else if (data[i][j] == 51 || data[i][j] == 52) {
                    divs[i][j].className = squarSize + '_current_5';//红色
                } else if (data[i][j] == 61 || data[i][j] == 62) {
                    divs[i][j].className = squarSize + '_current_6';//绿色
                } else if (data[i][j] == 81 || data[i][j] == 82) {
                    divs[i][j].className = squarSize + '_current_7';//浅蓝色
                } else if (data[i][j] == 1) {
                    divs[i][j].className = squarSize + '_block';//随机阻碍方块
                }else if (data[i][j] == 2) {
                    divs[i][j].className = squarSize + '_last';//随机阻碍方块
                }
            }
        }
    }
    // 检测点是否合法
    var check = function (pos, x, y) {
        if (pos.x + x < 0) {//上边界
            return false;
        } else if (pos.x + x >= gameData.length) {//下边界
            return false;
        } else if (pos.y + y < 0) {//左边界
            return false;
        } else if (pos.y + y >= gameData[0].length) {//右边界
            return false;
        } else if (gameData[pos.x + x][pos.y + y] == 1||gameData[pos.x + x][pos.y + y] == 11 || gameData[pos.x + x][pos.y + y] == 21 || gameData[pos.x + x][pos.y + y] == 31 || gameData[pos.x + x][pos.y + y] == 41 || gameData[pos.x + x][pos.y + y] == 51 || gameData[pos.x + x][pos.y + y] == 61 || gameData[pos.x + x][pos.y + y] == 81) {//下边有方块
            return false;
        } else {
            return true;
        }

    }
    //设置数据：将next区域方块映射到当前游戏区域
    var setData = function () {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
                }
            }
        }
    }
    //清除数据
    var clearData = function () {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 0;
                }
            }
        }
    }
    //检测多个点组成的数据是否合法
    var isValid = function (pos, data) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] != 0 && !check(pos, i, j)) {//检测方块是否合法
                    return false;
                }
            }
        }
        return true;
    }

    //初始化游戏区域
    var init = function (doms, type, dir, size) {
        gameDiv = doms.gameDiv;
        nextDiv = doms.nextDiv;
        resultDiv = doms.resultDiv;
        scoreDiv = doms.scoreDiv;
        lineDiv = doms.lineDiv;
        timeDiv = doms.timeDiv;
        speedDiv = doms.speedDiv;

        next = SquareFactory.prototype.make(type, dir);//在next区域生成方块
        initDiv(gameDiv, gameData, gameDivs, BIGSIZE, size);//初始化游戏区域
        initDiv(nextDiv, next.data, nextDivs, SMALLSIZE, NEXTSIZE);//初始化next区域
        refreshDiv(next.data, nextDivs, SMALLSIZE);//刷新next区域
    }
    // 下移
    var down = function () {
        if (cur.canDown(isValid)) {
            clearData();
            cur.down();
            setData();
            refreshDiv(gameData, gameDivs, BIGSIZE);
            return true;
        }
        else {
            return false;
        }
    }
    // 左移
    var left = function () {
        if (cur.canLeft(isValid)) {
            clearData();
            cur.left();
            setData();
            refreshDiv(gameData, gameDivs, BIGSIZE);
        }
    }
    // 右移
    var right = function () {
        if (cur.canRight(isValid)) {
            clearData();
            cur.right();
            setData();
            refreshDiv(gameData, gameDivs, BIGSIZE);
        }
    }
    // 旋转
    var rotate = function () {
        if (cur.canRotate(isValid)) {
            clearData();
            cur.rotate();
            setData();
            refreshDiv(gameData, gameDivs, BIGSIZE);
        }
    }
    //下落到底部后，当点合法且有数据为2时，将数据变为1来实现变颜色
    var fixed = function () {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j) && gameData[cur.origin.x + i][cur.origin.y + j] == 12) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 11;
                } else if (check(cur.origin, i, j) && gameData[cur.origin.x + i][cur.origin.y + j] == 22) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 21;
                } else if (check(cur.origin, i, j) && gameData[cur.origin.x + i][cur.origin.y + j] == 32) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 31;
                } else if (check(cur.origin, i, j) && gameData[cur.origin.x + i][cur.origin.y + j] == 42) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 41;
                } else if (check(cur.origin, i, j) && gameData[cur.origin.x + i][cur.origin.y + j] == 52) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 51;
                } else if (check(cur.origin, i, j) && gameData[cur.origin.x + i][cur.origin.y + j] == 62) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 61;
                } else if (check(cur.origin, i, j) && gameData[cur.origin.x + i][cur.origin.y + j] == 82) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 81;
                }
            }
        }
        refreshDiv(gameData, gameDivs, BIGSIZE);
    }

    //从下往上判断是否满足消行，是，将满足消行的上面数据依次下降一行，最顶行空一行补充空白数据
    var checkClear = function () {
        var line = 0;
        for (var i = gameData.length - 1; i >= 0; i--) {//从下往上遍历数据
            var clear = true;
            for (var j = 0; j < gameData[0].length; j++) {//从左往右遍历数据
                if (gameData[i][j] == 0) {//任意一格为空，不满足消行条件
                    clear = false;
                    break;
                }
            }
            if (clear) {
                line = line + 1;
                for (var m = i; m > 0; m--) {//从下往上遍历数据
                    for (var n = 0; n < gameData[0].length; n++) {//从左往右遍历数据
                        gameData[m][n] = gameData[m - 1][n];//依次将上面的数据下移
                    }
                }
                for (var n = 0; n < gameData[0].length; n++) {//将最顶行数据赋值为0
                    gameData[0][n] = 0;
                }
                i++;
            }
        }
        return line;
    }
    //生成下一个方块
    var performNext = function (type, dir) {
        cur = next;//下一个方块作为当前方块
        setData();//将方块映射到游戏区域
        next = SquareFactory.prototype.make(type, dir);//生成下一个方块
        refreshDiv(gameData, gameDivs, BIGSIZE);//更新游戏区域
        refreshDiv(next.data, nextDivs, SMALLSIZE);//更新NEXT区域
    }
    //判断游戏是否应该停止
    var checkGameOver = function () {
        var gameOver = false;
        for (var i = 0; i < gameData[0].length; i++) {//从上往下遍历
            if (gameData[1][i] == 81 || gameData[1][i] == 11 || gameData[1][i] == 21 || gameData[1][i] == 31 || gameData[1][i] == 41 || gameData[1][i] == 51 || gameData[1][i] == 61) {//如果第二行已经有变色的数据，游戏停止
                gameOver = true;
            }
        }
        return gameOver;
    }
    
    
    //游戏结束提示
    var gameOver = function (win) {
        if (win) {
            resultDiv.value = '成功!'
        } else {
            resultDiv.value = '失败!'
        }
    }
    var over = function () {
        resultDiv.value = '游戏结束!';
    }
    //计时
    var format = function (num) {
        return (num < 10 ? '0' + num : num);
    }
    var showTime = function (time) {
        H = format(parseInt(time / (60 * 60) % 24)),
        M = format(parseInt(time / 60 % 60)),
        S = format(parseInt(time % 60));
        timeDiv.value = H +':' + M +':'+ S;
    }
    var showSpeed =function(speed){
        speedDiv.value =speed;
    }
    //加分
    var addScore = function (line) {
        var s = 0;
        switch (line) {
            case 1:
                s = 10;
                break;
            case 2:
                s = 30;
                break;
            case 3:
                s = 60;
                break;
            case 4:
                s = 100;
                break;
            default:
                break;
        }
        score = score + s;
        scoreDiv.value = score;
    }
    

    
    
    //加行
    var addLine = function (line) {
        allLine = allLine + line;
        lineDiv.value = allLine;
    }
    //添加障碍,先上移之前的数据，底部添加随机数据生成障碍方块，更正当前方块的位置
    var addBlock = function (lines) {
        for (var i = 0; i < gameData.length - lines.length; i++) {
            gameData[i] = gameData[i + lines.length];//将后lines.length行上移lines.length
        }
        for (var i = 0; i < lines.length; i++) {//遍历lines，依次将数据赋值给后lines.length 行
            gameData[gameData.length - lines.length + i] = lines[i];//将lines数据依次赋值给后lines.length行
        }
        cur.origin.x = cur.origin.x - lines.length;//
        if (cur.origin.x < 0) {
            cur.origin.x = 0;
        }
        refreshDiv(gameData, gameDivs, BIGSIZE);
    }


    
    // 导出API
    this.init = init;
    this.down = down;
    this.left = left;
    this.right = right;
    this.rotate = rotate;
    this.fall = function () { while (down()); };
    this.fixed = fixed;
    this.performNext = performNext;
    this.checkClear = checkClear;
    this.checkGameOver = checkGameOver;
    this.gameOver = gameOver;
    this.over = over;
    this.addScore = addScore;
    this.addLine = addLine;
    this.addBlock = addBlock;
    this.showTime = showTime;
    this.showSpeed = showSpeed;


}