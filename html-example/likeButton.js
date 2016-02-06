
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

	$("div.blogFloat h3").each(function () {
		// Generate a unique identifier for the post — I'll use the title here, but this should be done better!
		var postid = $(this).text().replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/ /g, '');
		$(this).css("float", "left");
		$(this).after('<p id="' + postid + '"> <span style="margin-left:1em;background-color:orange;" onclick="likePost(\'' + postid + '\', \'' + userid + '\', this)"><i style="margin-right:0.5em;" class="fa fa-thumbs-up"></i><i style="margin-right:0.5em;" class="fa fa-thumbs-o-up"></i>Like this post!</span></p>');
	});
	
	var likesList;
	$.ajax({
			method: "POST",
			url: "https://schlachter.ca/sharepoint-like/getLikes",
			data: {
				sitekey: "7B8215BF76"
			}
		})
		.done(function (msg) {
			likesList = msg;
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
			console.log("Data Saved: " + msg);
		});
	console.log(caller);
	$(caller).find(".fa-thumbs-up").toggle();
	$(caller).find(".fa-thumbs-o-up").toggle();
}