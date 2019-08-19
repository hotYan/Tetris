//单机游戏战绩表
var trecord = {
	// 查看个人资料&查看数据
	checkByPhone: 'SELECT * FROM `trecord` WHERE `Phone`=? ',
	// 管理员查看所有注册登录玩家
	checkAll: 'SELECT * FROM `trecord` ',
	// 向数据库插入游戏记录
	insert: 'INSERT INTO `trecord` SET `Phone`=?,`RPhone`=?, `Time`=?,`Victory`=?  ',
	delete: 'DELETE FROM `trecord` WHERE `tr_Id`=?'
    
};

module.exports = trecord;