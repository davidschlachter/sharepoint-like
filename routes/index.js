
var express = require('express'),
	mongoose = require('mongoose'),
	router = express.Router();

// Define the 'likes' model
var likeModel = new mongoose.Schema({
	userid: String,
	postid: String,
	timestamp: {
		type: Date,
		default: Date.now
	}
});
var Like = mongoose.model('Like', likeModel);

// GET home page.
router.get('/', function (req, res, next) {
	console.log("Success");
});

module.exports = router;
