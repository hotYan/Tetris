# Tetris(俄罗斯方块)

## demo
### Introduction
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;课程源码


<br/>
<br/>


## v1.0

### How to use

1. clone并进入根目录

2. npm insatll

3. npm start

4. 浏览器打开localhost:3000

5. 效果图

<div align =center>
<img src='https://github.com/hotYan/Tetris/blob/v1.0/public/img/img.png' alt='img' height='450px' width="450px" />
</div> 


<br/>
<br/>


## v2.0
### Introduction
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;游戏模块，将单机游戏和实时对战结合在一起,美化了7种方块。其次，单机游戏从简单玩法改进为根据时间加速，加强了难度的同时统计了`历史最高`、`当前分数`、`已用时间` 、`当前速度`、`已消行数`，同时支持暂停游戏、游戏音效设置。

### How to use

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


9. 单人游戏效果图

<div align =center>
<img src='https://github.com/hotYan/Tetris/blob/v2.0/public/images/one.jpg' alt='img' height='450px' width="450px" />
</div>

10.  实时对战游戏效果图

<div align =center>
<img src='https://github.com/hotYan/Tetris/blob/v2.0/public/images/two.jpg' alt='img' height='400px' width="500px" />
</div>