var topic = require('../models/TopicEntity');

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
	}
}