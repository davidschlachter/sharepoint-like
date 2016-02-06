
var express = require('express');
var router = express.Router();
var likeController = require('../controllers/likes');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.status(200).send("This is the index.");
});

// POST a new like
router.post('/like', likeController.addLike);

// Get the current likes
router.post('/getLikes', likeController.getLikes);


module.exports = router;