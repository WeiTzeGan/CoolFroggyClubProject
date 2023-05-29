var express = require('express');
var router = express.Router();
const { redirect } = require('express/lib/response');

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '732733926826-h9vfvft404fo0i5eel2713ojb4iflhaq.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// NORMAL LOGIN
router.post('/login', function(req, res, next){

  let login_data = req.body;

  if ('username' in login_data && 'password' in login_data && 'type' in login_data){
    if (login_data.username !== '' && login_data.password !== '' && login_data.type !== ''){

      // Connect to the database
      req.pool.getConnection( function(cerr, connection){

        // handle connection error
        if (cerr){
          //console.log("Connection error");
          res.sendStatus(500);
        }

        // query part
        let query = "SELECT first_name, last_name, email FROM USERS WHERE user_id = ? AND user_password = ?";

        connection.query(query, [login_data.username, login_data.password], function(qerr, rows, fields){

          // release connection after query (sucessful or not)
          connection.release();

          // handle query error
          if (qerr){
            //console.log("Query error");
            res.sendStatus(401);
          }

          if (rows.length > 0){
            // There is a user

            // store the necessary user info (name, email, user_type)
            [req.session.user] = rows;
            req.session.user_type = login_data.type;

            res.json(req.session.user);

          } else {
            // No user
            res.sendStatus(401);
          }
        }); // connection.query
      });   // req.pool.getConnection

    }else{
      res.sendStatus(401);
    }
  }else{
    res.sendStatus(401);
  }
});

// LOG OUT FOR NORMAL LOGIN
router.post('/logout', function (req, res, next) {

  if ('username' in req.session) {
    delete req.session.username;
    delete req.session.user_type;
    res.end();
  } else {
    res.sendStatus(403);
  }

});

// GOOGLE LOGIN
router.post('/google-login', async function (req, res, next) {

  const ticket = await client.verifyIdToken({
    idToken: req.body.google_login_info.credential,
    audience: CLIENT_ID
  });
  const payload = ticket.getPayload();
  let email = payload['email'];
  //console.log(payload['email']);

  if ( 'type' in req.body === false && req.body.type === '' ){
    res.sendStatus(401);
  }

  // check against in the database if the user with the email exist
  // Connect to the database
  req.pool.getConnection( function(cerr, connection){

    // handle connection error
    if (cerr){
      console.log("Connection error");
      res.sendStatus(500);
    }

    // query part
    let query = "SELECT first_name, last_name, email FROM USERS WHERE email = ?";

    connection.query(query, [email], function(qerr, rows, fields){

      // release connection after query (sucessful or not)
      connection.release();

      // handle query error
      if (qerr){
        console.log("Query error");
        res.sendStatus(401);
      }

      if (rows.length > 0){
        // There is a user

        // store the necessary user info (name, email, user_type)
        [req.session.user] = rows;
        req.session.user_type = req.body.type;

        console.log(JSON.stringify(req.session.user));

        // res.json(req.session.user);

      } else {
        // No user
        res.sendStatus(401);
      }
    }); // connection.query
  });   // req.pool.getConnection

  //res.redirect('/');

});

/* Route to get events table */
router.get('/getEvents', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err){
      res.sendStatus(500);
    }

    let query = "SELECT EVENTS.*, CLUBS.club_name FROM EVENTS INNER JOIN CLUBS ON EVENTS.club_id = CLUBS.club_id";

    connection.query(query, function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
      }

      res.json(rows);
    });
  });
});

module.exports = router;
