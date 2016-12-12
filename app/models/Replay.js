/**
 * created by 薛将军 on 2016-12-12
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

var replaySchema = new Schema({
	replayId: {
		type: String,
		require: true,
	},
	replayer: String,
	replayTime: Date,
	replayContent: String,
	ups: {
		type: Number,
		default: 0
	}
})



//Model
var ReplayModel = mongoose.model('replay', replaySchema);


module.exports = ReplayModel;