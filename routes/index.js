var express = require('express');
var router = express.Router();
const { redirect } = require('express/lib/response');

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '732733926826-h9vfvft404fo0i5eel2713ojb4iflhaq.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// let check_signup = false;
// let signup_copy;
router.post('/signup', function(req, res, next){

  // if already logged in -> meaning already signed up-> stop
  if ('user' in req.session) {
    console.log("user already logged in");
    res.sendStatus(403);
    return;
  }

  let data = req.body;
  // signup_copy = data;
  console.log(data);

  // if req.body lacks these info
  if (!('first_name' in data) && !('last_name' in data) && !('dob' in data) && !('password' in data) && !('phone' in data) && !('email' in data)) {
    console.log("lack info");
    res.sendStatus(401);
    return;
  }

  // if the provided info is empty
  if (data.first_name === '' && data.last_name === '' && data.password === '' && data.email === '') {
    console.log("info empty");
    res.sendStatus(401);
    return;
  }

  req.pool.getConnection(function(cerr, connection){
    // handle connection error
    if (cerr){
      console.log("Connection error");
      res.sendStatus(500);
      return;
    }
    // query part
    let query1 = "SELECT first_name, last_name, email FROM USERS WHERE email = ?";
    // check if user already exist in database (based on first name, last name, password, EMAIL)
    connection.query(query1, [data.email, data.password], function(qerr, rows, fileds){

      // release connection after query
      connection.release();

      // handle query error
      if (qerr){
        console.log("Query error");
        res.sendStatus(401);
        return;
      }

      if (rows.length > 0){
        console.log("User with password/email already exists");
        res.sendStatus(403);
        return;
      }

       //////////////////////////////////////////////////////////////

      // if no user with the given email and password exists, redirect back to '/signup'
      req.pool.getConnection(function(cerr2, connection2){
         // handle connection error
          if (cerr2){
            console.log("Connection2 error");
            res.sendStatus(500);
            return;
          }

        // after checking and no errors raised, insert new user into USERS table
        let query2 = "INSERT INTO USERS(first_name, last_name, date_of_birth, user_password, email, mobile) VALUES(?, ?, ?, ?, ?, ?)";
        connection2.query(query2,
          [data.first_name, data.last_name, data.dob, data.password, data.email, data.mobile],
          function(qerr2, rows, fileds){

            connection2.release();

            if (qerr2){
              console.log("Query2 error");
              res.sendStatus(401);
              return;
            }

            // if insert sucess
            res.sendStatus(200);

          }); // connection.query2
      }); // req.pool.getConnection

    }); // connection.query1

  }); // req.pool.getConnection



}); // router

// NORMAL LOGIN
router.post('/login', function (req, res, next) {

  // if already logged in, stop logging in again
  if ('user' in req.session) {
    console.log("user already logged in");
    res.sendStatus(403);
    return;
  }

  let login_data = req.body;

  // if req.body lacks these info
  if (!('email' in login_data) && !('password' in login_data) && !('type' in login_data)) {
    res.sendStatus(401);
    return;
  }

  // if the provided info is empty
  if (login_data.email === '' && login_data.password === '' && login_data.type === '') {
    res.sendStatus(401);
    return;
  }


  // Connect to the database
  req.pool.getConnection(function (cerr, connection) {

    // handle connection error
    if (cerr) {
      //console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    // query part
    let query;
    if (login_data.type === 'Club Member') {
      query = "SELECT user_id, first_name, last_name, email FROM USERS WHERE email = ? AND user_password = ?";
    } else if (login_data.type === 'Club Manager') {
      query = "SELECT user_id, first_name, last_name, email, manager_id FROM CLUB_MANAGERS INNER JOIN USERS ON CLUB_MANAGERS.manager_id = USERS.user_id WHERE USERS.email = ? AND USERS.user_password = ?";
    } else if (login_data.type === 'Admin') {
      // redirect to a an admin route
      return; // return for now
    }

    connection.query(query, [login_data.email, login_data.password], function (qerr, rows, fields) {

      // release connection after query (sucessful or not)
      connection.release();

      // handle query error
      if (qerr) {
        //console.log("Query error");
        res.sendStatus(401);
        return;
      }

      if (rows.length > 0) {
        // There is a user

        // store the necessary user info (name, email, user_type)
        [req.session.user] = rows;
        req.session.user_type = login_data.type;
        console.log(JSON.stringify(req.session.user));
        res.json(req.session.user);

      } else {
        // No user
        res.sendStatus(401);
        return;
      }
    }); // connection.query
  });   // req.pool.getConnection
});

router.get('/checkLogin', function (req, res, next) {
  if ('user' in req.session) {
    res.sendStatus(200);
    return;
  } else {
    res.sendStatus(401);
    return;
  }
});

// LOG OUT FOR NORMAL LOGIN
router.post('/logout', function (req, res, next) {

  if ('user' in req.session) {
    delete req.session.user;
    delete req.session.user_type;
    res.end();
  } else {
    res.sendStatus(403);
    return;
  }

});

// GOOGLE LOGIN
router.post('/google-login', async function (req, res, next) {

  // if already logged in, stop logging in again
  if ('user' in req.session) {
    console.log("user already logged in");
    res.sendStatus(403);
    return;
  }

  // get the type of user that is loggin in
  let type = req.body.type;

  const ticket = await client.verifyIdToken({
    idToken: req.body.google_login_info.credential,
    audience: CLIENT_ID
  });
  const payload = ticket.getPayload();
  let email = payload['email'];
  //console.log(payload['email']);

  if ('type' in req.body === false || req.body.type === '') {
    res.sendStatus(401);
    return;
  }

  // check against in the database if the user with the email exist
  // Connect to the database
  req.pool.getConnection(function (cerr, connection) {

    // handle connection error
    if (cerr) {
      console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    // query part
    let query;

    if (type === 'Club Member') {
      query = "SELECT user_id, first_name, last_name, email FROM USERS WHERE email = ?";
    } else if (type === 'Club Manager') {
      query = "SELECT user_id, first_name, last_name, email, manager_id FROM CLUB_MANAGERS INNER JOIN USERS ON CLUB_MANAGERS.manager_id = USERS.user_id WHERE USERS.email = ?";
    } else if (type === 'Admin') {
      // redirect to a an admin route
      return; // return for now
    }

    connection.query(query, [email], function (qerr, rows, fields) {

      // release connection after query (sucessful or not)
      connection.release();

      // handle query error
      if (qerr) {
        console.log("Query error");
        res.sendStatus(401);
        return;
      }

      if (rows.length > 0) {
        // There is a user

        // store the necessary user info (name, email, user_type)
        [req.session.user] = rows;
        req.session.user_type = req.body.type;

        console.log(JSON.stringify(req.session.user));

        res.json(req.session.user);

      } else {
        // No user
        res.sendStatus(401);
        return;
      }
    }); // connection.query
  });   // req.pool.getConnection

  //res.redirect('/');

});

/* Route to get events table */
router.get('/getEvents', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT EVENTS.*, CLUBS.club_name FROM EVENTS INNER JOIN CLUBS ON EVENTS.club_id = CLUBS.club_id";

    connection.query(query, function (error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

/* Route to get announcements table */
router.get('/view-news', function(req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT ANNOUNCEMENTS.title, ANNOUNCEMENTS.post_message, ANNOUNCEMENTS.post_date, CLUBS.club_name AS author FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 0";

    connection.query(query, function (error, rows, fields) {
      connection.release();

      if (error) {
        console.log("Query error");
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

router.get('/view-clubs', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM CLUBS";

    connection.query(query, function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      res.json(rows);
    });
  });
});


module.exports = router;
