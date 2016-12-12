var replay = require('../models/ReplayEntity');
var moment = require('moment');

module.exports = {
	add: function(req, res) {
		var data = req.body;
		replay.add(data, function(e) {
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
				data: data
			})
		})
	}
}