
$(document).ready(function () {
	// Get the userID from the top-right menu
	var userid = $("span#zz17_Menu_t").text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');

	$("div.blogFloat h3").each(function () {
		// Generate a unique identifier for the post — I'll use the title here, but this should be done better!
		var postid = $(this).text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		$(this).css("float", "left");
		$(this).after('<p onclick="likePost("' + postid + '", "' + userid + '")"> Like this post!</p>');
	});
});



/*$.ajax({
		method: "POST",
		url: "https://schlachter.ca/sharepoint-like/like",
		data: {
			userid: user,
			postid: post
		}
	})
	.done(function (msg) {
		alert("Data Saved: " + msg);
	});*/