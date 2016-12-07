// var mongoose = require('mongoose');
// var db = mongoose.createConnection('localhost', 'myapp');

// db.on('error', function(error) {
// 	console.log(error)
// })
// db.once('open', function() {
// 	console.log("openned");
// })
// var PersonSchema = new mongoose.Schema({
// 	name: String,
// 	gender: Number
// });
// var PersonModel = db.model('Person', PersonSchema);
// var personEntity = new PersonModel({
// 	name: "薛将军",
// 	gender: 0
// });
// console.log(personEntity.gender)
// console.log(PersonSchema.methods)
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myapp');
var db = mongoose.connection;
db.on('error', function(err) {
	console.error(err)
})
db.once('open', function() {
	console.log('opened')
})
var personSchema = mongoose.Schema({
		name: String,
		age: Number,
		gender: Boolean
	})
	// var PersonModel = mongoose.model('person', personSchema);
	// var personEntity = new PersonModel({
	// 	name: "薛将军",
	// 	age: "24",
	// 	gender: true
	// })

personSchema.methods.speak = function(name, age, gender) {
	var name = this.name;
	var age = this.age;
	var gender = gender == gender ? '男' : '女';
	console.log(`我的名字是${name},我今年${age}岁,我是${gender}性`);
}
var PersonModel = mongoose.model('company', personSchema)
var who = new PersonModel({
	name: "薛将军33",
	age: 24
}, true);
// who.save(function(err, man) {
// 		if (err) return console.error(err);
// 		man.speak();
// 	})
// PersonModel.find({
// 	name: '李将军'
// }, function(err, person) {
// 	console.log(person)
// })
// PersonModel.find(function(err, man) {
// 	console.log(man)
// })

var mySchema = new mongoose.Schema({
	name: String,
	age: Number,
	// from: {
	// 	type: 'String',
	// 	enum: ['成都', '重庆']
	// }
	gender: {
		type: 'String',
		enum: ['0', '1']
	}
})
var MyModel = mongoose.model('person', mySchema)
var boy = new MyModel({
	name: "UFO",
	age: 999
		// from: '重庆'
		,
	gender: '1'
})
boy.save(function(error) {
	if (error) console.log(error.errors.from.message)
	db.close()
});