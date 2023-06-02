var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// User join clubs
router.post('/join-club', function(req, res, next){
  
});


// User view updates from clubs



// User RSVP for events




// User edit personal details

module.exports = router;
