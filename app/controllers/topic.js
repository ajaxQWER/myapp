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
			var replays = topic.replay.map(function(topic) {
				var replayId = topic.replayId;
				var replayer = topic.replayer;
				var replayTime = moment(topic.replayTime).fromNow();
				var replayContent = topic.replayContent;
				return {
					replayId: replayId,
					replayer: replayer,
					replayTime: replayTime,
					replayContent: replayContent
				}
			})
			res.render('topics', {
				username: req.session.user,
				create_date: moment(topic.create_date).format('YYYY/MM/DD HH:mm:ss'),
				topic: topic,
				replays: replays
			})
		})
	},
	replay: function(req, res) {
		var id = req.body.id;
		var data = req.body;
		topic.replay(id, data, function(e, id, time) {
			if (e) {
				console.log(e);
				res.json({
					success: false,
					error: e,
					msg: "添加评论失败！"
				})
			}
			res.json({
				success: true,
				msg: "添加评论成功！",
				data: {
					replayId: id,
					replayer: data.replayer,
					content: data.content,
					time: moment(time).fromNow()
				}
			})
		})
	},
	list: function(req, res) {
		var user = req.session.user
		topic.findByUser(user, function(e, data) {
			if (e) {
				console.log(e);
			}
			console.log(data)
			res.render('lists', {
				topics: data
			})

		})
	},
	getInfo: function(req, res) {
		var id = req.query.id;
		console.log(id)
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
			res.send(topic)
		})
	},
	update: function(req, res) {
		var id = req.body.id;
		var title = req.body.title;
		var content = req.body.content;
		console.log(id)
		console.log(title)
		console.log(content)
		topic.updateById(id, title, content, function(e) {
			if (e) {
				console.log(e)
			}
			res.send('修改成功')
		})
	}
}