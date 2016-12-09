var express = require('express');
var router = express.Router();
var index = require('../app/controllers/index');
var topic = require('../app/controllers/topic');
var user = require('../app/controllers/user');

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

router.get('/topic/:id', topic.findById);
router.post('/posts/addTopic', topic.add);
router.post('/regist', user.regist);
router.post('/login', user.login);
router.get('/getSession', user.getSession);
router.get('/signOut', user.signOut);

module.exports = router;