var express = require('express');
var router = express.Router();
var topic = require('../app/controllers/topic');
var user = require('../app/controllers/user');

router.get('/', function(req, res) {
	console.log('~~~~~~~~~~~~~~~~~~~~~~')
	console.log(req.session.user)
	res.render('home', {
		username: req.session.user
	})
})
router.post('/posts/addTopic', topic.add);
router.post('/regist', user.regist);
router.post('/login', user.login);
router.get('/getSession', user.getSession);
router.get('/signOut', user.signOut);

module.exports = router;