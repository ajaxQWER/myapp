/**
 *Created by 薛将军 on 2016-12-02.
 *
 *根据mongoose模型进行CRUD操作
 */
var TopicModel = require('./Topics');

var TopicEntity = function() {

};

TopicEntity.prototype.add = function(data, callback) {
	var topic = new TopicModel(data);
	topic.save(function(e) {
		if (e) {
			console.log('添加文章失败。');
			console.log(e)
			callback(e);
		} else {
			callback(null)
		}
	})
}

TopicEntity.prototype.findAll = function(callback) {
	TopicModel.find({}, function(e, tiopics) {
		callback(e, tiopics);
	}).sort({
		create_date: -1
	})
}

TopicEntity.prototype.findById = function(id, callback) {
	TopicModel.findOne({
		_id: id
	}, function(e, name) {
		callback(e, name)
	})
}



//Entity
module.exports = new TopicEntity();