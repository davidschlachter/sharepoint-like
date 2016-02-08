
var express = require('express');
var router = express.Router();
var likeController = require('../controllers/likes');

// Add a new like
router.post('/like', likeController.addLike);
router.get('/like', likeController.addLike);

// Get the current likes
router.post('/getLikes', likeController.getLikes);
router.get('/getLikes', likeController.getLikes);


module.exports = router;
