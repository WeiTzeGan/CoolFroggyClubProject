var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


// User join clubs
router.post('/join-club', function (req, res, next) {

  // MUST login to join club
  if ( !('user' in req.session) ){
    console.log("user haven't logged in");
    res.sendStatus(403);
    return;
  }

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
    connection.query(query1, [id_of_user, req.body.club_id], function (qerr, rows, fileds) {

      // release connection after query
      connection.release();

      // handle query error
      if (qerr) {
        console.log("Query error");
        res.sendStatus(401);
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
        connection2.query(query2, [id_of_user, req.body.club_id],
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



// User RSVP for events




// User edit personal details

module.exports = router;
