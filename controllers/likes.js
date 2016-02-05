
var mongoose = require('mongoose');

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

exports.addLike = function (req, res) {
	var query = {};
	if (req.body.userid && (typeof req.body.userid === 'string' || req.body.userid instanceof String)) {
		query.userid = scrub(req.body.userid);
	}
	if (req.body.postid && (typeof req.body.postid === 'string' || req.body.postid instanceof String)) {
		query.postid = scrub(req.body.postid);
	}

	var like = new Like(query);
	like.save(function (err) {
		if (err) {
			res.send(err);
			console.log("Error adding to database was: " + err);
		} else {
			console.log("Like added: ", query);
		}
	});
};

exports.getLikes = function (req, res) {
	var query = {};
	if (req.body.postid && (typeof req.body.postid === 'string' || req.body.postid instanceof String)) {
		query.postid = scrub(req.body.postid);
	}

	Like.find(query)
		.sort({
			timestamp: -1
		})
		.exec(function (err, likes) {
			if (err) {
				console.log("Query in getLikes returned an error:", err);
				res.send(err);
			} else {
				res.json(likes);
			}
		});
};

function scrub(rawinput) {
	var output;
	if (typeof rawinput === 'string' || rawinput instanceof String) {
		output = rawinput.replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
		return output;
	} else {
		return "";
	}
}