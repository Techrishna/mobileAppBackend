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

router.post('/update', function(req, res, next){
	model.Users.update(req.body, function(response){
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


router.get('/get_leaders_data_party/:party', function(req, res, next) {
	model.Users.get_leaders_data(req.query, req.params.party, function(response) {
		res.json(response);
	});
});

router.get('/get_user_data/:id', function(req, res, next) {
	model.Users.find_user_by_id(req.query, req.params.id, function(response){
		res.json(response);
	})
});	

router.get('/get_leaders_data/:id', function(req, res, next) {
	model.Users.get_leader_data_by_id(req.query, req.params.id, function(response){
		res.json(response);
	});
});


router.get('/get_biography_data_by_id/:id', function(req, res, next) {
	model.Users.get_biography_data_by_id(req.query, req.params.id, function(response){
		res.json(response);
	});
});

router.get('/get_commitments_data_by_id/:id', function(req, res, next) {
	model.Users.get_commitments_data_by_id(req.query, req.params.id, function(response){
		res.json(response);
	});
});

router.get('/get_projects_data_by_id/:id', function(req, res, next) {
	model.Users.get_projects_data_by_id(req.query, req.params.id, function(response){
		res.json(response);
	});
});

router.get('/get_photos_data_by_id/:id', function(req, res, next) {
	model.Users.get_photos_data_by_id(req.query, req.params.id, function(response){
		res.json(response);
	});
});

router.get('/get_videos_data_by_id/:id', function(req, res, next) {
	model.Users.get_videos_data_by_id(req.query, req.params.id, function(response){
		res.json(response);
	});
});

router.get('/get_speech_data_by_id/:id', function(req, res, next) {
	model.Users.get_speech_data_by_id(req.query, req.params.id, function(response){
		res.json(response);
	});
});

router.get('/get_leader_rating_by_user/:lid/:id', function(req, res, next) {
	model.Users.get_leader_rating(req.query, req.params.lid, req.params.id, function(response){
		res.json(response);
	});
});

router.get('/get_leaders_home_page/:id', function(req, res, next) {
	model.Users.get_home_page(req.query, req.params.id, function(response){
		res.json(response);
	});
})

router.post('/post_vote', function(req, res, next) {
	model.Users.update_votes(req.body, function(response) {
		res.json(response);
	});
});

router.post('/post_complaint', function(req, res, next){
	model.Users.insert_complaint(req.body, function(response){
		res.json(response);
	});
})

router.post('/post_rating', function(req, res, next){
	model.Users.insert_rating(req.body, function(response){
		res.json(response);
	});
});

router.post('/reset_password', function(req, res, next) {
	model.Users.reset_password(req.body, function(response){
		res.json(response);
	})
});

router.post('/add_commit', function(req, res, next){
	model.Users.add_commitment(req.body, function(response){
		res.json(response);
	})
})

router.post('/edit_biography', function(req, res, next){
	model.Users.edit_biography(req.body, function(response){
		res.json(response);
	});	
})

router.post('/edit_commit', function(req, res, next){
	model.Users.edit_commitment(req.body, function(response){
		res.json(response);
	})
})

router.post('/delete_commit', function(req, res, next){
	model.Users.delete_commitment(req.body, function(response){
		res.json(response);
	})
})

router.post('/add_project', function(req, res, next){
	model.Users.add_project(req.body, function(response){
		res.json(response);
	})
})

router.post('/edit_project', function(req, res, next){
	model.Users.edit_project(req.body, function(response){
		res.json(response);
	})
})

router.post('/delete_project', function(req, res, next){
	model.Users.delete_project(req.body, function(response){
		res.json(response);
	})
})


//here create the apis

module.exports = router;
