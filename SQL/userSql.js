//对user表进行操作
var user = {
    // 注册前查看手机号是否已经注册，昵称是否被用
    check:'SELECT `Phone` FROM `user` WHERE `Phone`=?',
    // 注册
    reg :'INSERT INTO `user` SET `Phone`=?, `Password`=?,`Name`=? ,`Sex`=?,`Age`=?,`Address`=? ',
    // 登录
    login:'SELECT * FROM `user` WHERE `Phone`=? AND `Password`=?',
    // 修改个人资料
    updateInfo : 'UPDATE `user` SET `Name`=? ,`Password`=?,`Sex`=?,`Age`=?,`Address`=? WHERE `Phone`=?',
    // 后台管理员删除注册登录玩家
    delete: 'DELETE FROM `user` WHERE `user_Id`=? ',
    // 查看个人资料&查看数据
    checkByPhone : 'SELECT * FROM `user` WHERE `Phone`=? ',
    // 后台管理员通过手机号&ID查找注册登录玩家
    checkByID : 'SELECT * FROM `user` WHERE `Phone`=?  OR `user_Id`=? ',

    // 管理员查看所有注册登录玩家
    checkAll : 'SELECT * FROM `user` ',
    // 修改数据
    updateData : 'UPDATE `user` SET `Total`=?,`WinRate`=?  WHERE `Phone`=?'

};
module.exports = user;