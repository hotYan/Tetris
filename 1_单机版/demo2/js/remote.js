var Remote = function(socket){
    var game;
    
    var bindEvents = function(){
        socket.on('init',function(data){
            start(data.type,data.dir);
        });
        socket.on('next',function(data){
            game.performNext(data.type,data.dir);
        });
        socket.on('rotate',function(){
            game.rotate();
        });
        socket.on('right',function(){
            game.right();
        });
        socket.on('left',function(){
            game.left();
        });
        socket.on('down',function(){
            game.down();
        });
        socket.on('fixed',function(){
            game.fixed();
        });
        socket.on('fall',function(){
            game.fall();
        });
        socket.on('line',function(data){
            game.checkClear();
            game.addScore(data);
        });
        socket.on('time',function(data){
            game.setTime(data);
        });
        socket.on('lose',function(data){
            game.gameOver(false);
        });
        socket.on('addTaiLines',function(data){
            game.addTaiLines(data);
        });
        
        
        
    }
    var start = function (type,dir) {//开始
        var doms = {
            gameDiv: document.getElementById('remote_game'),
            nextDiv: document.getElementById('remote_next'),
            timeDiv: document.getElementById('remote_time'),
            scoreDiv: document.getElementById('remote_score'),
            resultDiv:document.getElementById('remote_gameover')
        }
        game = new Game();
        game.init(doms, type, dir);
    }
    bindEvents();
}