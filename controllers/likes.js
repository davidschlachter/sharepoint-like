
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

exports.addLike = function (req, res, next) {
	var query = {};
	var returnScript = false;
	if (req.body.userid && (typeof req.body.userid === 'string' || req.body.userid instanceof String)) {
		query['userid'] = scrub(req.body.userid);
	} else if (req.query.userid && (typeof req.query.userid === 'string' || req.query.userid instanceof String)) {
		query['userid'] = scrub(req.query.userid);
		returnScript = true;
	} else {
		return next("Invalid or empty userid.");
	}
	if (req.body.postid && (typeof req.body.postid === 'string' || req.body.postid instanceof String)) {
		query['postid'] = scrub(req.body.postid);
	} else if (req.query.postid && (typeof req.query.postid === 'string' || req.query.postid instanceof String)) {
		query['postid'] = scrub(req.query.postid);
	} else {
		return next("Invalid or empty postid.");
	}
	if (req.body.sitekey && (typeof req.body.sitekey === 'string' || req.body.sitekey instanceof String)) {
		query['sitekey'] = scrub(req.body.sitekey);
	} else if (req.query.sitekey && (typeof req.query.sitekey === 'string' || req.query.sitekey instanceof String)) {
		query['sitekey'] = scrub(req.query.sitekey);
	} else {
		return next("Invalid or empty sitekey.");
	}

	console.log("The req.body was: ", req.body);
	console.log("The req.query was: ", req.query);

	Like.remove(query, function(err, result) {
		if (err) {
			console.log(err);
		}
		//console.log(result.result);
		if (result.result.n === 0) {
			Like.findOneAndUpdate(query, query, {
				upsert: true
			}, function (err, like) {
				if (err) {
					res.send(err);
					console.log("Error adding to database was: " + err);
				} else {
					//console.log("Like added: ", like);
				}
			});
		}
		delete query['postid'];
		delete query['userid'];
		//console.log("The query before being passed to getLikesList is: ", query);
		getLikesList(res, query, returnScript);
	});
};

exports.getLikes = function (req, res, next) {
	var query = {};
	var returnScript = false;
	if (req.body.sitekey && (typeof req.body.sitekey === 'string' || req.body.sitekey instanceof String)) {
		query['sitekey'] = scrub(req.body.sitekey);
	} else if (req.query.sitekey && (typeof req.query.sitekey === 'string' || req.query.sitekey instanceof String)) {
		query['sitekey'] = scrub(req.query.sitekey);
		returnScript = true;
	} else {
		return next("Invalid or empty sitekey.");
	}
	getLikesList(res, query, returnScript);
};

var getLikesList = function (res, query, returnScript) {
	//console.log("Sending likes list with query", query);
	Like.find(query)
		.sort({
			timestamp: -1
		})
		.exec(function (err, likes) {
			if (err) {
				console.log("Query in getLikes returned an error:", err);
				res.send(err);
			} else {
				//console.log("getLikesList is sending: ", likes);
				if (returnScript === false) {
					res.json(likes);
				} else {
					res.jsonp(likes);
				}
			}
		});
};

var scrub = function (rawinput) {
	var output;
	if (typeof rawinput === 'string' || rawinput instanceof String) {
		output = rawinput.replace(/[^0-9a-z, A-Z\-_ ’'‘ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]/g, '');
		return output;
	} else {
		return "";
	}
};
