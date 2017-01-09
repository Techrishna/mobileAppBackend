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
		res.json({success: true, user: response});
	});
});

router.post('/signup-leader', function(req, res, next){
	model.Users.signup_for_leader(req.body, function(response){
		res.json({success: true, user: response});
	});
});

//here create the apis

module.exports = router;
