var express = require('express');
var router = express.Router();
var index = require('../app/controllers/index');
var topic = require('../app/controllers/topic');
var user = require('../app/controllers/user');

//首页初始化
router.get('/', index.init);
//注册
router.post('/regist', user.regist);
//登录
router.post('/login', user.login);
//获得session
router.get('/getSession', user.getSession);
//退出登录
router.get('/signOut', user.signOut);
//添加文章
router.post('/posts/addTopic', topic.add);
//添加评论
router.post('/replay', topic.replay);
//文章列表
router.get('/posts/list', topic.list);
//查询具体文章
router.get('/posts/topic/:id', topic.findById);
//获取修改文章信息
router.get('/posts/update/getInfo', topic.getInfo);
//修改文章
router.put('/posts/update', topic.update);
//删除文章
router.delete('/posts/delete', topic.delete);
//点赞评论
router.post('/posts/ups', topic.ups)

module.exports = router;