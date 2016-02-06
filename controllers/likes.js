
var mongoose = require('mongoose');

// Define the 'likes' model
var likeModel = new mongoose.Schema({
	userid: String,
	postid: String,
	sitekey: String,
	timestamp: {
		type: Date,
		default: Date.now
	}
});
var Like = mongoose.model('Like', likeModel);

exports.addLike = function (req, res) {
	var query = {};
	if (req.body.userid && (typeof req.body.userid === 'string' || req.body.userid instanceof String)) {
		query['userid'] = scrub(req.body.userid);
	}
	if (req.body.postid && (typeof req.body.postid === 'string' || req.body.postid instanceof String)) {
		query['postid'] = scrub(req.body.postid);
	}
	if (req.body.sitekey && (typeof req.body.sitekey === 'string' || req.body.sitekey instanceof String)) {
		query['sitekey'] = scrub(req.body.sitekey);
	}

	console.log("The req.body was: ", req.body);

	Like.remove(query, function(err, result) {
		if (err) {
			console.log(err);
		}
		console.log(result.result);
		if (result.result.n === 0) {
			Like.findOneAndUpdate(query, query, {
				upsert: true
			}, function (err, like) {
				if (err) {
					res.send(err);
					console.log("Error adding to database was: " + err);
				} else {
					console.log("Like added: ", like);
				}
			});
		}
		delete query['postid'];
		delete query['userid'];
		console.log("The query before being passed to getLikesList is: ", query);
		getLikesList(res, query);
	});
};

exports.getLikes = function (req, res) {
	var query = {};
	if (req.body.sitekey && (typeof req.body.sitekey === 'string' || req.body.sitekey instanceof String)) {
		query['sitekey'] = scrub(req.body.sitekey);
	}
	getLikesList(res, query);
};

var getLikesList = function (res, query) {
	Like.find(query)
		.sort({
			timestamp: -1
		})
		.exec(function (err, likes) {
			if (err) {
				console.log("Query in getLikes returned an error:", err);
				res.send(err);
			} else {
				console.log("getLikesList is sending: ", likes);
				res.json(likes);
			}
		});
};

var scrub = function (rawinput) {
	var output;
	if (typeof rawinput === 'string' || rawinput instanceof String) {
		output = rawinput.replace(/[^a-z, A-Z\-_ ’'‘ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]/g, '');
		return output;
	} else {
		return "";
	}
};