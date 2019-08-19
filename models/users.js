
/**
 * 
 */
var pool = require('./db'), // 连接数据库
    user = require('../SQL/userSql'),//
    tRecord = require('../SQL/twoRecordSql'),
    oRecord = require('../SQL/oneRecordSql'),
    crypto = require('crypto'); // 对密码进行加密

module.exports = {
    // 对字符串进行sha1加密
    hash: function (str) {
        return crypto.createHmac('sha1', str).update('love').digest('hex');
    },
    // 注册
    // 因数据库操作是异步操作，则需要传入回调函数来对结果进行处理，而不能使用return的方式
    reg: function (Phone, Password, Name,Sex,Age,Address, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            // 首先检测用户名是否已注册
            connection.query(user.check, [Phone], function (err, sele_res) {
                if (err) throw err;
                if (sele_res.length) {// 若用户名已存在，则直接回调
                    cb({ isExisted: true });
                    connection.release();
                } else {// 否则将信息插入到数据库中
                    var params = { Phone: Phone,Password: Password, Name: Name,  Sex: Sex,Age:Age,Address:Address };
                    connection.query('INSERT INTO `user` SET ?', params, function (err, insert_res) {
                        if (err) throw err;
                        cb(insert_res);
                        connection.release();
                    })
                }
            })
        })
    },
    // 登录
    login: function (Phone, Password, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(user.login, [Phone, Password], function (err, result) {
                if (err) throw err;
                cb(result);
                connection.release();
                // 接下来connection已经无法使用，它已经被返回到连接池中 
            })
        })
    },
    checkInfo: function (Phone, cb) {//通过手机号查询user表，查看个人资料，
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(user.checkByPhone, [Phone], function (err, result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },
    check: function (Phone,Phone_1,Phone_2, cb) {//通过手机号查询user表，查看个人资料，
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query('SELECT * FROM `user` WHERE `Phone`=? UNION SELECT * FROM `orecord` WHERE `Phone`=?  ORDER BY `Score` DESC UNION SELECT * FROM `orecord` WHERE `Phone`=?  ORDER BY `Line` DESC', [Phone,Phone_1,Phone_2], function (err, result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },
    checkLine: function (Phone, cb) {//通过手机号查询user表，查看个人资料，
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(oRecord.maxLine, [Phone], function (err, result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },
    
    updataInfo: function (Name, Password, Sex, Age, Address, Phone, cb) {//修改个人资料
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(user.updateInfo, [Name, Password, Sex, Age, Address, Phone], function (err,result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },
    getGameOne: function (Phone, cb) {//查询最高分
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(oRecord.maxScore,[Phone],function (err,result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },
    postGameOne: function (Phone, Time, Line, Score,cb) {//插入游戏记录
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(oRecord.insert, [Phone, Time, Line, Score], function (err,result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },
    postGameTwo: function (Phone, RPhone,Time, Victory,cb) {//插入游戏记录
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(tRecord.insert, [Phone, RPhone,Time, Victory], function (err,result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },




    //后台
    checkUsers: function (cb) {//查看所有玩家
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(user.checkAll, function (err, result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },
    deleteUser: function (user_Id, cb) {//删除玩家
        console.log(user_Id);
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(user.delete, [user_Id], function (err, result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },
    oRecords: function (cb) {//查看所有单机战绩
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(oRecord.checkAll, function (err, result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },
    oRecord: function (Phone,cb) {//通过手机号查看玩家单机战绩
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(oRecord.checkByPhone, [Phone],function (err, result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },
    deleteOr: function (or_Id, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(oRecord.delete, [or_Id], function (err, result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },
    tRecords: function (cb) {//查看所有实时战绩
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(tRecord.checkAll, function (err, result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },
    tRecord: function (Phone,cb) {//通过手机号查看玩家实时战绩
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(tRecord.checkByPhone, [Phone],function (err, result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },
    deleteTr: function (tr_Id, cb) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(tRecord.delete, [tr_Id], function (err, result) {
                if (err) throw err;
                cb(result);
                connection.release();
            })
        })
    },
    date: function () {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDay);//获取AddDayCount天后的日期 
        var y = dd.getFullYear();
        var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
        return y + "-" + m + "-" + d;

    },
    

}

