var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//加载依赖库
//加载路由控制
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();//创建app实例

var server = require('http').Server(app);
var io = require('socket.io')(server);
var session = require('express-session');//登录状态管理
// var sharedsession = require("express-socket.io-session");

var port = 3000;
server.listen(port, function () {
    console.log('Server listening at port: ' + port);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());//定义cookie解析器
app.use(session({//定义用户session
    secret: 'hotyan',  // 用来对session id相关的cookie进行签名
    // store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: true,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 24 * 60 * 60 * 1000  // 有效期一天，单位是毫秒
    }
}));
app.use(function (req, res, next) {
    // 如果session中存在，则说明已经登录
    if (req.session.user) {
        res.locals.user = {
            Phone: req.session.user.Phone,
            Name: req.session.user.Name
        }
    } else {
        res.locals.user = {};
    }
    next();
})
//定义静态文件路径
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);//匹配路由路径
app.use('/users', usersRouter);

var clientCount = 0;//客户端计数
var socketMap = {};//用来存储客户端socket

var bindListener = function (socket, event) {
    socket.on(event, function (data) {//socket接收到init消息
        if (socket.clientNum % 2 == 0) {
            if (socketMap[(socket.clientNum - 1)]) {//判断用户数量，偶数个，将init消息转发给前一个用户发
                socketMap[(socket.clientNum - 1)].emit(event, data);
            }
        } else {//奇数个，将init消息转发给下一个用户发
            if (socketMap[(socket.clientNum + 1)]) {
                socketMap[(socket.clientNum + 1)].emit(event, data);
            }
        }
    });
}


io.on('connection', function (socket) {
    clientCount = clientCount + 1;      //新用户连接上
    socket.clientNum = clientCount;     //存入socket
    socketMap[clientCount] = socket;    //{clientCount:socket}

    if (clientCount % 2 == 1) {         //只有一个用户，提示等待
        socket.emit('waiting', 'waiting for another person!');//给奇数用户先发送等待消息
    } else {
        if(socketMap[(clientCount - 1)]){//匹配成功，给匹配双方都发送start消息
            // console.log('第2个id：'+socket.id);
            // console.log('第1个id：'+socketMap[(clientCount - 1)].id);
            socket.emit('start'); 
            socket.emit('two',socket.id);//将自己的发给对手
            socketMap[(clientCount - 1)].emit('start');//给正在准备的发
            socketMap[(clientCount - 1)].emit('one',socketMap[(clientCount - 1)].id);//正在准备的玩家
        }else{
            socket.emit('leave');
        } 
    }
    
    bindListener(socket,'init');
    bindListener(socket,'next');
    bindListener(socket,'down');
    bindListener(socket,'left');
    bindListener(socket,'right');
    bindListener(socket,'rotate');
    bindListener(socket,'fixed');
    bindListener(socket,'fall');
    bindListener(socket,'line');
    bindListener(socket,'lose');
    bindListener(socket,'addLines');
    bindListener(socket,'addBlock');
    bindListener(socket,'twoRemote');
    bindListener(socket,'oneRemote');
    socket.on('disconnect', function () {
        if (socket.clientNum % 2 == 0 ){
            if(socketMap[(socket.clientNum - 1)]) {
                socketMap[(socket.clientNum - 1)].emit('leave');
            } 
        }else {
            if(socketMap[(socket.clientNum + 1)]){
                socketMap[(socket.clientNum + 1)].emit('leave');
            }
        }
        delete(socketMap[socket.clientNum]);
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
