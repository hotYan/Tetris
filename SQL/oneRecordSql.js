//单机游戏战绩表
var orecord = {

	// 查看个人资料&查看数据
	checkByPhone: 'SELECT * FROM `orecord` WHERE `Phone`=? ',
	// 管理员查看所有注册登录玩家
	checkAll: 'SELECT * FROM `orecord` ',
	// 在单机界面显示最大分数
	maxLine: 'SELECT * FROM `orecord` WHERE `Phone`=?  ORDER BY `Score` DESC ',
	// 在单机界面显示最多行数
	maxScore: 'SELECT * FROM `orecord` WHERE `Phone`=?  ORDER BY `Line` DESC ',
	// 向数据库插入游戏记录
	insert: 'INSERT INTO `orecord` SET `Phone`=?, `Time`=?,`Line`=? ,`Score`=? ',
    delete: 'DELETE FROM `orecord` WHERE `or_Id`=?'

};

module.exports = orecord;