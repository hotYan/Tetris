// 俄罗斯方块核心代码
var Game = function () {
    var nextData = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
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

    var gameDiv;
    var nextDiv;
    var resultDiv;
    var gameDivs = [];
    var nextDivs = [];
    var cur;
    var next;
    const NEXTSIZE = 20;
    const GAMETYPE = 'game';
    const NEXTTYPE = 'next';

    var initDiv = function (container, data, divs,type,size) {//初始化gameData
        for (var i = 0; i < data.length; i++) {
            var div = [];
            for (var j = 0; j < data[0].length; j++) {
                var newNode = document.createElement('div');
                newNode.className = type+'_none';
                newNode.style.top = (i * size) + 'px';
                newNode.style.left = (j * size) + 'px';
                container.appendChild(newNode);
                div.push(newNode);
            }
            divs.push(div);
        }
    }
    var refreshDiv = function (data, divs,type) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] == 0) {
                    divs[i][j].className = type+'_none';//初始化方块
                } else if (data[i][j] == 1) {
                    divs[i][j].className = type+'_done';//完成的方块
                } else if (data[i][j] == 2) {
                    divs[i][j].className = type+'_current';//当前的方块
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
        } else if (gameData[pos.x + x][pos.y + y] == 1) {//下边有方块
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
    var init = function (doms,type,dir,size) {
        gameDiv = doms.gameDiv;
        nextDiv = doms.nextDiv;
        resultDiv = doms.resultDiv;
        next = SquareFactory.prototype.make(type,dir);//在next区域生成方块
        initDiv(gameDiv, gameData, gameDivs,GAMETYPE,size);//初始化游戏区域
        // initDiv(remoteDiv, gameData, gameDivs,GAMETYPE,GAMESIZE);//初始化游戏区域
        initDiv(nextDiv, next.data, nextDivs,NEXTTYPE,NEXTSIZE);//初始化next区域
        refreshDiv(next.data, nextDivs,NEXTTYPE);//刷新next区域
    }
    // 下移
    var down = function () {
        if (cur.canDown(isValid)) {
            clearData();
            cur.down();
            setData();
            refreshDiv(gameData, gameDivs,GAMETYPE);
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
            refreshDiv(gameData, gameDivs,GAMETYPE);
        }
    }
    // 右移
    var right = function () {
        if (cur.canRight(isValid)) {
            clearData();
            cur.right();
            setData();
            refreshDiv(gameData, gameDivs,GAMETYPE);
        }
    }
    // 旋转
    var rotate = function () {
        if (cur.canRotate(isValid)) {
            clearData();
            cur.rotate();
            setData();
            refreshDiv(gameData, gameDivs,GAMETYPE);
        }
    }
    //下落到底部后，当点合法且有数据为2时，将数据变为1来实现变颜色
    var fixed = function () {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j) && gameData[cur.origin.x + i][cur.origin.y + j] == 2) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 1;
                }
            }
        }
        refreshDiv(gameData, gameDivs,GAMETYPE);
    }
    
    //从下往上判断是否满足消行，是，将满足消行的上面数据依次下降一行，最顶行空一行补充空白数据
    var checkClear = function () {
        var line = 0;
        for (var i = gameData.length - 1; i >= 0; i--) {//从下往上遍历数据
            var clear = true;
            for (var j = 0; j < gameData[0].length; j++) {//从左往右遍历数据
                if (gameData[i][j] != 1) {//不满足消行条件
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
        refreshDiv(gameData, gameDivs,GAMETYPE);//更新游戏区域
        refreshDiv(next.data, nextDivs,NEXTTYPE);//更新NEXT区域
    }
    //判断游戏是否应该停止
    var checkGameOver = function(){
        var gameOver = false;
        for(var i=0;i<gameData[0].length;i++){//从上往下遍历
            if(gameData[1][i] == 1){//如果第二行已经有变色的数据，游戏停止
                gameOver = true;
            }
        }
        return gameOver;
    }
    //游戏结束提示
    var gameOver = function(win){
        if(win){
            resultDiv.innerHTML = '成 功！'
        }else{
            resultDiv.innerHTML = '失 败！'
        }
    }
    //添加障碍,先上移之前的数据，底部添加随机数据生成障碍方块，更正当前方块的位置
    var addBlock = function(lines){
        for(var i=0; i<gameData.length-lines.length; i++){
            gameData[i] = gameData[i + lines.length];//将后lines.length行上移lines.length
        }
        for(var i=0; i<lines.length; i++){//遍历lines，依次将数据赋值给后lines.length 行
            gameData[gameData.length - lines.length + i] = lines[i];//将lines数据依次赋值给后lines.length行
        }
        cur.origin.x = cur.origin.x - lines.length;//
        if(cur.origin.x < 0){
            cur.origin.x = 0;
        }
        refreshDiv(gameData,gameDivs,GAMETYPE);
    }

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
    this.addBlock = addBlock;


}