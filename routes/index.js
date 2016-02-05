
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



// POST a new like
router.post('/like', addLike);


function addLike(req, res, next) {
	var query[];
	if (req.body.userid && typeof req.body.userid === 'string' || req.body.userid instanceof String) query[userid] = scrub(req.body.userid);
	if (req.body.postid && typeof req.body.postid === 'string' || req.body.postid instanceof String) query[postid] = scrub(req.body.postid);
	
	// Create a new instance of the like model
	var like = new Like(query);

	// Save the like and check for errors
	like.save(function (err) {
		if (err) {
			res.send(err);
			console.log("Error adding to database was: " + err);
		} else {
			console.log("Like added: ", query);
		}
	});
	
	return next();
}

function scrub(rawinput) {
	var output;
	if (typeof rawinput === 'string' || rawinput instanceof String) {
		output = rawinput.replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
		return output;
	} else {
		return "";
	}
}


module.exports = router;
