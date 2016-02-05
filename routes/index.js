
var express = require('express'),
	mongoose = require('mongoose'),
	router = express.Router();


// GET home page.
router.get('/', function (req, res, next) {
	console.log("Success");
});

module.exports = router;
