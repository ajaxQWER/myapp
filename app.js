var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var ejs = require("ejs");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

var config = require('./routes/config')
var router = require('./routes/router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'html');
app.engine('.html', ejs.__express);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '/public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/app/views')));

//session
var store = new MongoDBStore({
	url: config.session,
	collection: 'session'
}, function(error) {
	if (error) console.log(error);
})

// Catch errors 
store.on('error', function(error) {
	assert.ifError(error);
	assert.ok(false);
});

app.use(require('express-session')({
	secret: config.cookieSecret,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 30 // 1 month 
	},
	store: store,
	// Boilerplate options, see: 
	// * https://www.npmjs.com/package/express-session#resave 
	// * https://www.npmjs.com/package/express-session#saveuninitialized 
	resave: false,
	saveUninitialized: false
}));

app.use('/', router)

// app.get('/link1', function(req, res) {
// 		console.log('~~~~~~~~')
// 		res.end()
// 	})
// app.post('/regist', function(req, res) {
// 	console.log(req.body)
// 	res.json({
// 		a: 1,
// 		b: 3
// 	})
// })
// app.get('/posts', function(req, res) {
// 	res.end()
// })
// app.get('/topic/:topicId', function(req, res) {
// 	console.log(req.params.topicId)
// 	res.end()
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

var server = require('http').createServer(app);
var port = process.env.PORT || config.port;
server.listen(port, function() {
	console.log('监听端口:' + port);
	console.log('监听时间:' + new Date())
});
// module.exports = app;