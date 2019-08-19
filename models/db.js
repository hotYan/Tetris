var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'xxxxxxx',//链接数据库密码
    database: 'teries'
});


module.exports = pool;  