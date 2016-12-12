/**
 *Created by 薛将军 on 2016-12-12.
 *
 *根据mongoose模型进行CRUD操作
 */
var ReplayModel = require('./Replay');

var ReplayEntity = function() {

};
ReplayEntity.prototype.add = function(data, callback) {
	var replay = new ReplayModel(data);
	replay.save(function(e) {
		if (e) {
			console.log('添加评论失败。');
			console.log(e)
			callback(e);
		} else {
			callback(null);
		}
	})
}

//Entity
module.exports = new ReplayEntity();