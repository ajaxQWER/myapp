var topic = require('../models/TopicEntity');
var moment = require('moment');
module.exports = {
	add: function(req, res) {
		var data = req.body;
		topic.add(data, function(e) {
			if (e) {
				console.log(e);
				res.json({
					success: false,
					error: e,
					msg: "添加文章失败！"
				})
			}
			res.json({
				success: true,
				msg: "添加文章成功！"
			})
		})
	},
	findAll: function(req, res) {
		topic.findAll(function(e, topics) {
			if (e) {
				console.log(e);
				res.json({
					success: false,
					error: e,
					msg: "查找所有文章失败！"
				})
			}
			res.render('home', {
				username: req.session.user,
				topics: topics
			})
		})
	},
	findById: function(req, res) {
		var id = req.params.id;
		topic.findById(id, function(e, topic) {
			if (e) {
				console.log(e);
			}
			if (!topic) {
				res.json({
					success: false,
					msg: '文章不存在'
				})
			}
			console.log(topic)
			res.render('topics', {
				username: req.session.user,
				create_date: moment(topic.create_date).format('YYYY/MM/DD HH:mm:ss'),
				topic: topic
			})
		})
	}
}