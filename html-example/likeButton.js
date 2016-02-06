
// Protect from weird console issues
(function() {
  // Union of Chrome, Firefox, IE, Opera, and Safari console methods
  var methods = ["assert", "cd", "clear", "count", "countReset",
    "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed",
    "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd",
    "select", "table", "time", "timeEnd", "timeStamp", "timeline",
    "timelineEnd", "trace", "warn"];
  var length = methods.length;
  var console = (window.console = window.console || {});
  var method;
  var noop = function() {};
  while (length--) {
    method = methods[length];
    // define undefined methods as noops to prevent errors
    if (!console[method])
      console[method] = noop;
  }
})();

var userid;


// Add FontAwesome stylesheet
var cssId = 'fontawesome';
if (!document.getElementById(cssId)) {
	var head = document.getElementsByTagName('head')[0];
	var link = document.createElement('link');
	link.id = cssId;
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css';
	link.media = 'all';
	head.appendChild(link);
}


// Add the like buttons
$(document).ready(function () {
	// Get the userID from the top-right menu
	userid = $("span#zz17_Menu_t").text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');

	$("div.blogFloat").each(function () {
		// Generate a unique identifier for the post — I'll use the title here, but this should be done better!
		var postid = $(this).find("h3").text().replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/ /g, '');
		$(this).find("h3").css("float", "left");
		$(this).find("h3").after('<p id="' + postid + '"> <span style="margin-left:1em;border: 1px solid rgb(128,128,128);padding:0.2em;padding-right:0.4em;" onclick="likePost(\'' + postid + '\', \'' + userid + '\', this)"><i style="margin-right:0.5em;" class="fa fa-thumbs-up"></i><i style="margin-right:0.5em;" class="fa fa-thumbs-o-up"></i>Like</span><span class="counter" style="margin-left:0;border: 1px solid rgb(128,128,128);padding:0.2em 0.5em 0.2em;">0</span></p>');
		console.log(this);
		$(this).find(".fa-thumbs-up").toggle();
	});
	
	$.ajax({
			method: "POST",
			url: "https://schlachter.ca/sharepoint-like/getLikes",
			data: {
				sitekey: "7B8215BF76"
			}
		})
		.done(function (likesList) {
			processLikes(likesList);
		});
});


// When like button is clicked...
var likePost = function (postid, userid, caller) {
	console.log("We have clicked it!");
	$.ajax({
			method: "POST",
			url: "https://schlachter.ca/sharepoint-like/like",
			data: {
				userid: userid,
				postid: postid,
				sitekey: "7B8215BF76"
			}
		})
		.done(function (msg) {
			processLikes(msg);
		});
	console.log(caller);
}

var processLikes = function (likesList) {
	console.log(likesList);
	// Now, go through an update the state of each like button, based on if the current user has liked it!
	var postid, i, count, userLikesIt;
	$("div.blogFloat").each(function () {
		count = 0;
		userLikesIt = false;
		postid = $(this).find("h3").text().replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/ /g, '');
		for (i = 0; i < likesList.length; i++) {
		    if (likesList[i].postid === postid) {
				count = count + 1;
		    	if (likesList[i].userid === userid) {
					$(this).find(".fa-thumbs-up").show();
					$(this).find(".fa-thumbs-o-up").hide();
					userLikesIt = true;
		    	}
		    }
		}
		$(this).find(".counter").text(count);
		if (userLikesIt === false) {
			$(this).find(".fa-thumbs-up").hide();
			$(this).find(".fa-thumbs-o-up").show();
		}
	});
};