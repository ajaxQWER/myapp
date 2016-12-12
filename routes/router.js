var express = require('express');
var router = express.Router();
var index = require('../app/controllers/index');
var topic = require('../app/controllers/topic');
var user = require('../app/controllers/user');
// var replay = require('../app/controllers/replay');

// router.get('/', function(req, res) {
// 	console.log('~~~~~~~~~~~~~~~~~~~~~~')
// 	var topics = topic.findAll();
// 	console.log(topics)
// 	res.render('home', {
// 		username: req.session.user,
// 		topics: topics
// 	})
// })
router.get('/', index.init)
	// router.get('/', topic.findAll)

//查询具体文章
router.get('/topic/:id', topic.findById);
//添加文章
router.post('/posts/addTopic', topic.add);
//注册
router.post('/regist', user.regist);
//登录
router.post('/login', user.login);
//获得session
router.get('/getSession', user.getSession);
//退出登录
router.get('/signOut', user.signOut);
//添加评论
router.post('/replay', topic.replay);

module.exports = router;