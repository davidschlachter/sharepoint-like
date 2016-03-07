
var express = require('express');
var router = express.Router();
var likeController = require('../controllers/likes');
var commentController = require('../controllers/comments');

// Add a new like
router.post('/like', likeController.addLike);
router.get('/like', likeController.addLike);

// Get the current likes
router.post('/getLikes', likeController.getLikes);
router.get('/getLikes', likeController.getLikes);

// Add a new comment
router.post('/comment', commentController.addComment);
router.get('/comment', commentController.addComment);

// Get the current comments
router.post('/getComments', commentController.getComments);
router.get('/getComments', commentController.getComments);

// Delete a comment
router.post('/deleteComment', commentController.deleteComment);
router.get('/deleteComment', commentController.deleteComment);

module.exports = router;
