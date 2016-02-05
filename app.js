
"use strict";

var express = require('express'),
	path = require('path'),
	logger = require('morgan'),
	compression = require('compression'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser');

var routes = require('./routes/index');
var mongooseconfig = require('./config/mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/sharepoint-like", mongooseconfig.options);
var db = mongoose.connection;
db.on('error', function (err) {
	console.log('Connection error to MongoDB database ', err);
});
db.once('open', function () {
	console.log('Connected to the MongoDB database.');
});

var app = express();

app.use(logger('dev'));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
