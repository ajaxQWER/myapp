/**
 *Created by 薛将军 on 2016-12-02.
 *
 *根据mongoose模型进行CRUD操作
 */
var TopicModel = require('./Topics');

var TopicEntity = function() {};

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

TopicEntity.prototype.findByUser = function(user, callback) {
	TopicModel.find({
		author: user
	}, function(e, name) {
		callback(e, name)
	}).sort({
		create_date: -1
	})
}

TopicEntity.prototype.replay = function(id, data, callback) {
	var replayId = new TopicModel().id;
	var replayTime = new TopicModel().create_date;
	TopicModel.update({
		_id: id
	}, {
		$push: {
			replay: {
				replayId: replayId,
				replayer: data.replayer,
				replayTime: replayTime,
				replayContent: data.content,
				ups: Number
			}
		}

	}, function(e) {
		callback(e, replayId, replayTime)
	})
}

TopicEntity.prototype.updateById = function(id, title, content, callback) {
	TopicModel.update({
		_id: id
	}, {
		$set: {
			title: title,
			content: content,
			update_date: new TopicModel().update_date
		}
	}, function(e) {
		callback(e)
	})
}

//Entity
module.exports = new TopicEntity();