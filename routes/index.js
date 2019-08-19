var express = require('express'),
  user_m = require('../models/users'),// 引入model
  router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'index' });
});

router.get('/game', function (req, res, next) {
  res.render('game', { title: 'game' });
});


router.get('/login', function (req, res, next) {
  res.render('login', { errmsg: '' });
});
router.post('/login', function (req, res, next) {
  var Phone = req.body.Phone || '',
    Password = req.body.Password || '';
  // var password_hash = user_m.hash(Password);
  user_m.login(Phone, Password, function (result) {
    if (result.length) {
      req.session.user = {
        Phone: result[0].Phone,
        Name: result[0].Name
      }
      res.redirect('/');//跳到首页
    } else {
      res.render('login', { errmsg: '用户名或密码错误' });
    }
  })
});

router.get('/reg', function (req, res, next) {
  res.render('reg', { errmsg: '' });
});
router.post('/reg', function (req, res, next) {
  var Phone = req.body.Phone || '',
    Password = req.body.Password || '',
    Password2 = req.body.Password2 || '',
    Name = req.body.Name || '',
    Sex = req.body.Sex || '',
    Age = req.body.Age || '',
    Address = req.body.Address || '';

  if (Password != Password2) {
    res.render('reg', { errmsg: '密码不一致' });
    return;
  }
  // var password_hash = user_m.hash(Password); // 对密码进行加密
  // 数据库处理
  user_m.reg(Phone, Password, Name, Sex, Age, Address, function (result) {
    if (result.isExisted) {
      res.render('reg', { errmsg: '手机号已注册' }); // 重新加载注册模板，并提示用户名已存在
    } else if (result.affectedRows) {
      // 注册成功
      res.redirect('/login');//注册成功后登录
    } else {
      // console.log('登录失败');
      res.render('reg', { errmsg: '注册失败，请重新尝试' });
    }
  })
});

router.get('/data', function (req, res, next) {
  var Phone = req.session.user.Phone;
  
  user_m.checkInfo(Phone,function (result) {
    // console.log(result);
    res.render('data', {
      title: '个人中心',
      datas: result
      
    })
  });
});

router.get('/change', function (req, res, next) {
  var Phone = req.session.user.Phone;
  user_m.checkInfo(Phone, function (result) {
    console.log(result);
    res.render('change', {
      title: '个人中心',
      msg: '',
      datas: result
    })
  })
});

router.post('/change', function (req, res, next) {
  var Phone = req.session.user.Phone,
    Password = req.body.Password || '',
    Name = req.body.Name || '',
    Sex = req.body.Sex || '',
    Age = req.body.Age || '',
    Address = req.body.Address || '';
  // var password_hash = user_m.hash(Password); // 对密码进行加密
  user_m.updataInfo(Name, Password, Sex, Age, Address, Phone, function (result) {
    console.log(result);
    res.redirect('/data');
    // res.render('change', { title: 'change', datas: result,msg: '修改成功！' });
  })
});


router.get('/gameOne', function (req, res, next) {
  var Phone;
  if (req.session.user) {
    Phone = req.session.user.Phone;
    user_m.getGameOne(Phone, function (result) {
      res.render('gameOne', {
        title: '单人游戏',
        datas: result
      })
    })
  }
});
router.post('/gameOne', function (req, res, next) {
  var Phone = req.session.user.Phone,
      Score = req.body.Score || '',
      Line = req.body.Line || '',
      Over = req.body.Over|| '';
      Time = new Date();
  if(Over == '游戏结束!' && Score!= 0&& Line!=0){//正常结束游戏
    user_m.postGameOne(Phone,Time,Line,Score, function (result) {
      res.render('gameOne', {title: '单人游戏', datas: result})
    })
  }
  else{
    res.redirect('/gameOne');//非正常结束，直接重新开始
  } 
});

router.get('/gameTwo', function (req, res, next) {
  res.render('gameTwo', { title: '新手过招' });
});
router.post('/gameTwo', function (req, res, next) {
  var Phone = req.body.localID || '',
      RPhone = req.body.remoteID || '',
      victory = req.body.Over || '';
      Time = new Date();
      console.log(Phone);
      console.log(RPhone);
      if(victory == '成功!'){
        Victory = 1;
      }else{
        Victory = 0;
      }
    user_m.postGameTwo(Phone,RPhone,Time,Victory, function (result) {
      res.render('gameTwo', {
        title: '实时对战'
      })
    })
});
router.get('/gameThree', function (req, res, next) {
  res.render('gameThree', { title: '棋逢对手' });
});

/////////////////////////
// 后台管理系统
router.get('/back', function (req, res, next) {
  user_m.checkUsers(function (result) {
    if (result.length) {
      res.render('back', {
        title: '查看所有玩家',
        datas: result
      })
    } else {
      res.render('back', { title: 'back', datas: result,msg: '还没有用户哦！' });
    }
  })
});
router.post('/back', function (req, res, next) {
  var Phone = req.body.Phone || '';
  user_m.checkInfo(Phone, function (result) {
    if (result.length) {
      res.render('back', {
        title: 'phone',
        datas: result
      })
    } else {
      res.render('back', { title: 'back', datas: result,msg: '手机号未注册！' });
     
    }
  })
});

router.post('/back_2', function (req, res, next) {
  var user_Id = req.body.user_Id;
  console.log('收到：'+user_Id);
  user_m.deleteUser(user_Id, function (result) {
    console.log('删除成功！');
    res.redirect('/back');
  })
});

router.get('/backA', function (req, res, next) {
  user_m.oRecords(function (result) {
    if (result.length) {
      res.render('backA', {
        title: '单机战绩',
        datas: result
      })
    } else {
      res.render('backA', { title: 'backA',datas: result, msg: '还没有战绩哦！' });
    }
  })
});

router.post('/backA', function (req, res, next) {
  var Phone = req.body.Phone || '';
  user_m.oRecord(Phone, function (result) {
    if (result.length) {
      res.render('backA', {
        title: '单机战绩',
        datas: result
      })
    } else {
      res.render('backA', { title: 'backA',datas: result, msg: '手机号未注册或还没有战绩哦！' });
      // res.redirect('/back');
    }
  })
});
router.post('/backA_2', function (req, res, next) {
  var or_Id = req.body.or_Id || '';
  user_m.deleteOr(or_Id, function (result) {
    res.redirect('/backA');
  })
});


router.get('/backB', function (req, res, next) {
  user_m.tRecords(function (result) {
    if (result.length) {
      res.render('backB', {
        title: '实时战绩',
        datas: result
      })
    } else {
      res.render('backB', { title: 'backB',datas: result, msg: '还没有战绩哦！' });
    }
  })
});

router.post('/backB', function (req, res, next) {
  var Phone = req.body.Phone || '';
  user_m.tRecord(Phone, function (result) {
    if (result.length) {
      res.render('backB', {
        title: '单机战绩',
        datas: result
      })
    } else {
      res.render('backB', { title: 'backB',datas: result, msg: '手机号未注册或还没有战绩！' });
      // res.redirect('/backB');
    }
  })
});
router.post('/backB_2', function (req, res, next) {
  var tr_Id = req.body.tr_Id || '';
  user_m.deleteTr(tr_Id, function (result) {
    res.redirect('/backB');
  })
});


module.exports = router;
