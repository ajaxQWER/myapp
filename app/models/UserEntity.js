/**
 *Created by 薛将军 on 2016-12-02.
 *
 *根据mongoose模型进行CRUD操作
 */
var User = require('./User');
var UserEntity = function() {

};

UserEntity.prototype.check = function(username, callback) {
	User.findOne({
		username: username
	}, function(e, name) {
		callback(e, name)
	})
}
UserEntity.prototype.add = function(data, callback) {
	var user = new User(data);
	user.save(function(e) {
		if (e) {
			console.log('添加用户失败。');
			console.log(e)
			callback(e);
		} else {
			callback(null)
		}
	})
}

// UserEntity.prototype.login = function(username){}

//Entity
module.exports = new UserEntity();