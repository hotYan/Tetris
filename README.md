
### Express + EJS + MySQL 项目

1. node运行环境

2. clone后进入项目根目录

3. 安装项目依赖

        $ npm install 

4. 启动项目

        $ npm run start

5. 连接数据库，创建数据库

        //连接
        $ mysql.server start
        $ mysql -u root -p
        //创建数据库
        >SHOW DATABASES;  //查看
        >CREATE DATABASE database_name; //新建
        >USE database_name;     //切换数据库
        ----补充----
        //重启
        $ mysql.server restart
        //退出
        mysql> exit
        $ mysql.server stop




6. 配置models/db.js文件

        var pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'XXXXXX',//链接数据库密码
            database: 'teries'
        });

7. 将teries.sql导入新建数据库

        >source  teries.sql的路径       //Mac可直接拖文件
        >SHOW TABLES;   //查看表


8. 访问localhost://3000


#### 单人游戏

<div align =center>
<img src='https://github.com/hotYan/graduationProject/blob/master/public/images/one.jpg' alt='img' height='450px' width="450px" />
</div>

#### 实时对战游戏

<div align =center>
<img src='https://github.com/hotYan/graduationProject/blob/master/public/images/two.jpg' alt='img' height='400px' width="500px" />
</div>