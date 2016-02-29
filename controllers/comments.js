
var mongoose = require('mongoose');

// Define the 'comments' model
var commentModel = new mongoose.Schema({
	userid: String,
	postid: String,
	sitekey: String,
	commentText: String,
	timestamp: {
		type: Date,
		default: Date.now
	}
});
var Comment = mongoose.model('Comment', commentModel);

exports.addComment = function (req, res, next) {
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
	if (req.body.commentText && (typeof req.body.commentText === 'string' || req.body.commentText instanceof String)) {
                query['commentText'] = scrub(req.body.commentText);
        } else if (req.query.commentText && (typeof req.query.commentText === 'string' || req.query.commentText instanceof String)) {
                query['commentText'] = scrub(req.query.commentText);
        } else {
                return next("Invalid or empty commentText.");
        }

	console.log("The req.body was: ", req.body);
	console.log("The req.query was: ", req.query);

	Comment.create(query, function(err, result) {
		if (err) {
			console.log(err);
		}
		//console.log(result.result);
		delete query['userid'];
		delete query['commentText'];
		//console.log("The query before being passed to getCommentsList is: ", query);
		getCommentsList(res, query, returnScript);
	});
};

exports.getComments = function (req, res, next) {
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
	getCommentsList(res, query, returnScript);
};

var getCommentsList = function (res, query, returnScript) {
	//console.log("Sending comments list with query", query);
	Comment.find(query)
		.sort({
			timestamp: -1
		})
		.exec(function (err, comments) {
			if (err) {
				console.log("Query in getComments returned an error:", err);
				res.send(err);
			} else {
				//console.log("getCommentsList is sending: ", comments);
				if (returnScript === false) {
					res.json(comments);
				} else {
					res.jsonp(comments);
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
