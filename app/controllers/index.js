var topic = require('../models/TopicEntity');
var moment = require('moment');
//设置为中文
moment.locale('zh-cn');
module.exports = {
	init: function(req, res) {
		topic.findAll(function(e, topics) {
			if (e) {
				console.log(e);
				res.json({
					success: false,
					error: e,
					msg: "查找所有文章失败！"
				})
			}
			var newTopics = topics.map(function(topic) {
					var id = topic._id;
					var title = topic.title;
					var author = topic.author;
					var content = topic.content;
					var ups = topic.ups;
					var create_date = moment(topic.create_date).fromNow();
					return {
						id: id,
						title: title,
						author: author,
						content: content,
						ups: ups,
						create_date: create_date
					};
				})
				// res.end()
			res.render('home', {
				username: req.session.user,
				topics: newTopics
			})
		})
	}
}