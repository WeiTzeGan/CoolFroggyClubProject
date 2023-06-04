var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.use('/', function(req, res, next){
  if (!('user' in req.session)){
    console.log("User has not logged in");
    res.sendStatus(401);
  }else{
    next();
  }
});

// User join clubs
router.post('/join-club', function (req, res, next) {

  let id_of_user = req.session.user.user_id;

  req.pool.getConnection(function (cerr, connection) {
    // handle connection error
    if (cerr) {
      console.log("Connection error");
      res.sendStatus(500);
      return;
    }
    // query part
    let query1 = "SELECT club_id, user_id FROM CLUB_MEMBERS WHERE club_id = ? AND user_id = ?";
    // check if user already exist in database (based on first name, last name, password, EMAIL)
    connection.query(query1, [req.body.club_id, id_of_user], function (qerr, rows, fileds) {

      // release connection after query
      connection.release();

      // handle query error
      if (qerr) {
        console.log("Query error");
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        console.log("Club Member already exists");
        res.sendStatus(403);
        return;
      }

      //////////////////////////////////////////////////////////////

      // if no user with the given email and password exists, redirect back to '/signup'
      req.pool.getConnection(function (cerr2, connection2) {
        // handle connection error
        if (cerr2) {
          console.log("Connection2 error");
          res.sendStatus(500);
          return;
        }

        // after checking and no errors raised, insert new user into USERS table
        let query2 = "INSERT INTO CLUB_MEMBERS(club_id, user_id) VALUES(?, ?)";
        connection2.query(query2, [req.body.club_id, id_of_user],
          function (qerr2, rows, fileds) {

            connection2.release();

            if (qerr2) {
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


// User view updates from clubs

//STILL IN PROGRESS, NOT DONE YET
router.get('/view-club-updates', function(req, res, next){

  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    // // check for which type of new we want to see (all, past or upcoming news)
    // if (req.body.type === 'all'){
    //   query = "SELECT ANNOUNCEMENTS.title, ANNOUNCEMENTS.post_message, ANNOUNCEMENTS.post_date, CLUBS.club_name AS author FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 0";
    // }else if ('type' in req.body && req.body.type === 'past'){
    //   query = "SELECT ANNOUNCEMENTS.title, ANNOUNCEMENTS.post_message, ANNOUNCEMENTS.post_date, CLUBS.club_name AS author FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 0 AND ANNOUNCEMENTS.post_date < CURDATE()";
    // }else if ('type' in req.body && req.body.type === 'upcoming'){
    //   query = "SELECT ANNOUNCEMENTS.title, ANNOUNCEMENTS.post_message, ANNOUNCEMENTS.post_date, CLUBS.club_name AS author FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 0 AND ANNOUNCEMENTS.post_date >= CURDATE()";
    // }else{
    //   connection.release();
    //   res.sendStatus(403);
    //   return;
    // }

    let query = "SELECT ANNOUNCEMENTS.title, ANNOUNCEMENTS.post_message, ANNOUNCEMENTS.post_date, CLUBS.club_name AS author FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 0";

    connection.query(query, function (error, rows, fields) {
      connection.release();

      if (error) {
        console.log("Query error");
        res.sendStatus(500);
        return;
      }

      // if there is no rows that match query
      if (rows.length === 0){
        res.sendStatus(404);
      }

      res.json(rows);
    });
  });
});


// User RSVP for events
router.post('/join-event', function(req, res, next){

  let id_of_user = req.session.user.user_id;

  req.pool.getConnection(function (cerr, connection) {
    // handle connection error
    if (cerr) {
      console.log("Connection error");
      res.sendStatus(500);
      return;
    }
    // query part
    let query1 = "SELECT event_id, participant_id FROM EVENTGOERS WHERE event_id = ? AND participant_id = ?";
    // check if user already exist in event record based on event_id and participant_id (aka user_id)
    connection.query(query1, [req.body.event_id, id_of_user], function (qerr, rows, fileds) {

      // release connection after query
      connection.release();

      // handle query error
      if (qerr) {
        console.log("Query error");
        res.sendStatus(401);
        return;
      }

      if (rows.length > 0) {
        console.log("Event already registered");
        res.sendStatus(403);
        return;
      }

      //////////////////////////////////////////////////////////////

      // if no user with the given email and password exists, redirect back to '/signup'
      req.pool.getConnection(function (cerr2, connection2) {
        // handle connection error
        if (cerr2) {
          console.log("Connection2 error");
          res.sendStatus(500);
          return;
        }

        // after checking and no errors raised, insert new user into USERS table
        let query2 = "INSERT INTO EVENTGOERS(event_id, participant_id) VALUES(?, ?)";
        connection2.query(query2, [req.body.event_id, id_of_user],
          function (qerr2, rows, fileds) {

            connection2.release();

            if (qerr2) {
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

});

// User get personal details
router.get('/info', function(req, res, next){

  let userID = req.session.user.user_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT first_name, last_name, date_of_birth, email, mobile FROM USERS WHERE user_id = ?";

    connection.query(query, [userID], function(error, rows, fields) {
      connection.release();

      if (error) {
        console.log("Query error");
        res.sendStatus(401);
        return;
      }

      if (rows.length === 0){
        res.sendStatus(404);
        return;
      }

      res.json(rows);

    }); // connection.query

  }); // req.pool.getConnection

});


// User edit personal details
router.post('/update-info', function(req, res, next) {
  var newPassword = req.body.new_password;
  var newEmail = req.body.new_email;
  var newMobile = req.body.new_mobile;
  var userID = req.session.user.user_id;


  // Hash the password with 10 salt rounds
  bcrypt.hash(newPassword, 10, function(err, hashedPassword) {
    if (err) {
      console.log("Password hashing error");
      res.sendStatus(500);
      return;
    }

    req.pool.getConnection(function(err, connection) {
      if (err) {
        console.log("Connection error");
        res.sendStatus(500);
        return;
      }

      let query = "UPDATE USERS SET user_password = ?, email = ?, mobile = ? WHERE user_id = ?";

      connection.query(query, [hashedPassword, newEmail, newMobile, userID], function(error, rows, fields) {
        connection.release();

        if (error) {
          console.log("Query error");
          res.sendStatus(401);
          return;
        }

        res.sendStatus(200);

      }); // connection.query

    }); // req.pool.getConnection

  }); // bcrypt.hash
});

module.exports = router;
