var user = require('../models/UserEntity');
/**
 * [crypto description]
 * @type {[type]}
 * Calculates the digest of all of the data passed to be hashed (using the hash.update() method). 
 * The encoding can be 'hex', 'latin1' or 'base64'. 
 * If encoding is provided a string will be returned; otherwise a Buffer is returned.
 * eg:hash.update().digest('hex/latin1/base64')
 */
//nodejs自带加密模块crypto
var crypto = require('crypto');
module.exports = {
	regist: function(req, res) {
		//md5
		var md5 = crypto.createHash('md5');
		var username = req.body.username;
		var password = req.body.password;
		var confirm = req.body.confirm;
		//前端两次不一致直接return，这里再做一次确认
		if (password !== confirm) {
			res.json({
				success: false,
				msg: "两次密码不一致"
			})
		}
		//加密方式有三种:hex,latin1,base64，这里选择base64
		var passwordByMd5 = md5.update(password).digest('base64');
		var data = {
			username: username,
			password: passwordByMd5
		}

		user.check(username, function(e, name) {
			if (e) {
				console.log(e);
			}
			if (name) {
				res.json({
					success: false,
					msg: "用户已存在"
				})
			} else {
				user.add(data, function(e) {
					if (e) {
						console.log(e);
						res.json({
							success: false,
							error: e,
							msg: '注册失败！'
						})
					}
					res.json({
						success: true,
						msg: '注册成功！'
					})
				})
			}
		})
	},
	login: function(req, res) {
		var username = req.body.username.trim();
		var password = req.body.password.trim();
		var md5 = crypto.createHash('md5');
		var passwordByMd5 = md5.update(password).digest('base64');
		user.check(username, function(e, name) {
			if (e) {
				console.log(e);
			}
			if (!name) {
				res.json({
					success: false,
					msg: "用户不存在！"
				})
				return;
			}
			if (name.username !== username) {
				res.json({
					success: false,
					msg: "用户名或密码错误！"
				})
				return;
			} else if (name.password !== passwordByMd5) {
				res.json({
					success: false,
					msg: "用户名或密码错误！"
				})
				return;
			} else {
				req.session.user = name.username;
				res.json({
					success: true,
					msg: "登录成功!",
					user: name.username
				})
			}
		})
	},
	getSession: function(req, res) {
		var user = req.session.user;
		if (user) {
			res.json({
				success: true,
				user: user
			})
		} else {
			res.json({
				success: false,
				user: ''
			})
		}
	},
	signOut: function(req, res) {
		req.session.user = null;
		res.json({
			success: true
		})
	}

}