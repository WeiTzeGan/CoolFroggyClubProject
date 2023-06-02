var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Route to view all users */
router.get('/viewUsers', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT user_id, first_name, last_name, date_of_birth, email, mobile FROM USERS";

    connection.query(query, function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

/* Route to remove users from database */
router.delete('deleteUsers', function(req, res, next) {
  var userID = req.body.user_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "DELETE FROM USERS WHERE user_id = ?";

    connection.query(query, [userID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

/* Route to view all clubs */
router.get('/viewClubs', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT club_id, club_name, club_manager_id FROM CLUBS";

    connection.query(query, function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

/* Route to remove specific clubs */
router.delete('deleteUsers', function(req, res, next) {
  var clubID = req.body.club_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "DELETE FROM CLUBS WHERE user_id = ?";

    connection.query(query, [clubID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

/* Route to view all other admins */
router.get('/viewAdmins', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT admin_id, first_name, last_name, date_of_birth, email, mobile FROM ADMINS";

    connection.query(query, function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

/* Route to sign up other admins */
router.post('/registerAdmins', function(req, res, next) {
  var firstName = req.body.first_name;
  var lastName = req.body.last_name;
  var dob = req.body.date_of_birth;
  var adminPassword = req.body.admin_password;
  var adminEmail = req.body.email;
  var adminMobile = req.body.mobile;

  // To check if admin already exists
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM ADMINS WHERE first_name = ? AND last_name = ?";

    connection.query(query, [firstName, lastName], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        console.log("Admin already exists");
        res.sendStatus(403);
        return;
      }

      // If passes above, add to admins table
      req.pool.getConnection(function(cerr, connection) {
        if (cerr) {
          res.sendStatus(500);
          return;
        }

        let query2 = "INSERT INTO ADMINS (first_name, last_name, date_of_birth, admin_password, email, mobile) VALUES (?, ?, ?, ?, ?, ?)";

        connection.query(query2, [firstName, lastName, dob, adminPassword, adminEmail, adminMobile], function(error, rows, fields) {
          connection.release();

          if (error) {
            res.sendStatus(500);
            return;
          }

          res.sendStatus(200);
        });
      });
    });
  });
});

/* Route to view pending club */
router.get("/viewPendingClubs", function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM PENDING_CLUBS";

    connection.query(query, function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

/* Route to approve pending club */
router.post('/addClub', function(req, res, next) {
  var clubName = req.body.club_name;
  var clubDescription = req.body.club_description;
  var clubManager = req.body.user_id;
  var clubPhone = req.body.phone;
  var clubEmail = req.body.email;

  // To check if club already exists
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM CLUBS WHERE club_name = ?";

    connection.query(query, [clubName], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        console.log("Club already exists");
        res.sendStatus(403);
        return;
      }

      // If passes above, add to pending_clubs table
      req.pool.getConnection(function(cerr, connection) {
        if (cerr) {
          res.sendStatus(500);
          return;
        }

        let query2 = "INSERT INTO CLUBS (club_name, club_description, club_manager_id, phone, email) VALUES (?, ?, ?, ?, ?)";

        connection.query(query2, [clubName, clubDescription, clubManager, clubPhone, clubEmail], function(error, rows, fields) {
          connection.release();

          if (error) {
            res.sendStatus(500);
            return;
          }

          res.sendStatus(200);
        });
      });
    });
  });
});

module.exports = router;