var express = require('express');
var router = express.Router();
var m = require('../modules');
var model = new m();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', function(req, res, next){
	model.Users.signup(req.body, function(response){
		res.json(response);
	});
});

router.post('/signup-leader', function(req, res, next){
	model.Users.signup_for_leader(req.body, function(response){
		res.json(response);
	});
});

router.post('/login', function(req, res, next){
	model.Users.login(req.body, function(response){
		res.json(response);
	});
});


router.get('/get_leaders_data', function(req, res, next) {
	model.Users.get_leaders_data(req.query, function(response) {
		res.json(response);
	});
});


router.post('/post_vote', function(req, res, next) {
	model.Users.update_votes(req.body, function(response) {
		res.json(response);
	});
});


//here create the apis

module.exports = router;
