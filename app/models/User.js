/**
 * created by 薛将军 on 2016-12-02
 * 
 * @type {Schema}
 *
 * Schema  ：  一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
 *
 * Model   ：  由Schema发布生成的模型，相当于管理数据库属性和行为的类
 *
 * Entity  ：  由Model创建的实体，它的操作也会影响数据库
 */

var mongoose = require('./mongodb');
var Schema = mongoose.Schema;

//Schema
var userSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	regist_date: {
		type: Date,
		default: Date.now
	}
})

//Model
var UserModel = mongoose.model('user', userSchema);


module.exports = UserModel;