var mongoose = require('mongoose');
var config = require('../../routes/config');
mongoose.connect(config.db);
// var MONGO = {
// 	username: "ajax",
// 	password: "xueshangke920305",
// 	server: 'ds131878.mlab.com',
// 	port: '31878',
// 	db: 'xuejiangjun',
// 	connectionString: function() {
// 		return 'mongodb://' + this.username + ':' + this.password + '@' + this.server + ':' + this.port + '/' + this.db;
// 	},
// 	options: {
// 		server: {
// 			auto_reconnect: true,
// 			socketOptions: {
// 				connectTimeoutMS: 3600000,
// 				keepAlive: 3600000,
// 				socketTimeoutMS: 3600000
// 			}
// 		}
// 	}
// };

// var db = mongoose.createConnection(MONGO.connectionString(), MONGO.options);

// db.on('error', function(err) {
// 	console.log("DB connection Error: " + err);
// });
// db.on('open', function() {
// 	console.log("DB connected");
// });
// db.on('close', function(str) {
// 	console.log("DB disconnected: " + str);
// });


module.exports = mongoose;