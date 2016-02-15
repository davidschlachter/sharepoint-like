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
$(document).ready(function() {
	// Get the userID from the top-right menu
	userid = $("span#zz17_Menu_t").text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');

	$("div.blogFloat").each(function() {
		// Generate a unique identifier for the post
		var postid = $(this).find("h3").attr('id');
		//$(this).find("h3").css("float", "left");
		$(this).find("h3").before('<p> <span class="likeButtonSpan" style="margin-left:1em;border: 1px solid rgb(128,128,128);padding:0.2em;padding-right:0.4em;background-color:white;cursor:pointer;" onclick="likePost(\'' + postid + '\', \'' + userid + '\', this)"><i style="margin-right:0.5em;" class="fa fa-thumbs-up"></i><i style="margin-right:0.5em;" class="fa fa-thumbs-o-up"></i>Like</span><span class="likesContainer" id="' + postid + '"><span class="counter" style="margin-left:0;border: 1px solid rgb(128,128,128);padding:0.2em 0.5em 0.2em;">0</span></span><span style="display:none;position:absolute;background-color:rgb(102,102,102);color:white;padding:0 0.3em 0;left:0;top:0;font-size:80%;width:10em;" id="' + postid + 'LikesList"></span></p>');
		$(this).find("p").css("float", "right");
		$(this).find(".fa-thumbs-up").toggle();
	});

	// Show the likes list
	var postid, itsheight, itswidth;
	$('.likesContainer').on('mouseover', function(event) {
		postid = $(this).attr('id');
		itsheight = $(this).height() + 10;
		itswidth = $('#' + postid + 'LikesList').offset().left - 10;// + 58;
		$('#' + postid + 'LikesList').parent().css({
			position: 'relative'
		});
		$('#' + postid + 'LikesList').css({
			top: itsheight,
			left: itswidth,
			position: 'absolute',
			'z-index': 10
		});
		$('#' + postid + 'LikesList').show();
	});
	$('.likesContainer').on('mouseout', function(event) {
		var postid = $(this).attr('id');
		$('#' + postid + 'LikesList').hide();
	});

	var langText = $(".ms-siteactionsmenu").text();
	if (langText.indexOf('Actions du site') >= 0) {
		$(".likeButtonSpan").each(function() {
			$(this).html($(this).html().replace(/Like/g,"J'aime"));
		});
	}
	
	$.ajax({
		method: "GET",
		url: "https://schlachter.ca/sharepoint-like/getLikes",
		dataType: 'jsonp',
		data: {
			sitekey: "498sjk212"
		},
		success: function(likesList) {
			processLikes(likesList);
		}
	});
});


// When like button is clicked...
var likePost = function(postid, userid, caller) {
	$.ajax({
		method: "GET",
		url: "https://schlachter.ca/sharepoint-like/like",
		dataType: 'jsonp',
		data: {
			userid: userid,
			postid: postid,
			sitekey: "498sjk212"
		},
		success: function(likesList) {
			processLikes(likesList);
		}
	});
}

var processLikes = function(likesList) {
	// Now, go through an update the state of each like button, based on if the current user has liked it!
	var postid, i, j, count, userLikesIt, users, neatUsers;
	$("div.blogFloat").each(function() {
		count = 0;
		users = [];
		userLikesIt = false;
		postid = $(this).find("h3").attr('id');
		for (i = 0; i < likesList.length; i++) {
			if (likesList[i].postid === postid) {
				count = count + 1;
				users.push(likesList[i].userid)
				if (likesList[i].userid === userid) {
					$(this).find(".fa-thumbs-up").show();
					$(this).find(".fa-thumbs-o-up").hide();
					userLikesIt = true;
				}
			}
		}
		$(this).find(".counter").text(count);
		neatUsers = "";
		for (j = 0; j < users.length; j++) {
			neatUsers = neatUsers + users[j] + "<br>";
		}
		$(this).find('#' + postid + 'LikesList').html(neatUsers);
		if (userLikesIt === false) {
			$(this).find(".fa-thumbs-up").hide();
			$(this).find(".fa-thumbs-o-up").show();
		}
	});
};
