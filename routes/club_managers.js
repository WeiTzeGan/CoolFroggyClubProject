var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Route to manage own user information */
router.post('/updateInfo', function(req, res, next) {
  var newPassword = req.body.new_password;
  var newEmail = req.body.new_email;
  var newMobile = req.body.new_mobile;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
    }

    let query = "UPDATE USERS SET user_password = ?, email = ?, mobile = ? WHERE user_id = ?";

    connection.query(query, [newPassword, newEmail, newMobile], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
      }

      res.sendStatus(200);
    });
  });
});

/* Route to view club members */
router.get('/viewMembers', function(req, res, next) {
  var clubID = req.body.club_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
    }

    let query = "SELECT CLUB_MEMBERS.user_id, USERS.first_name, USERS.last_name FROM CLUB_MEMBERS INNER JOIN USERS ON CLUB_MEMBERS.user_id = USERS.user_id WHERE CLUB_MEMBERS.club_id = ?";

    connection.query(query, [clubID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
      }

      res.json(rows);
    });
  });
});

/* Router to remove club members */
router.delete('/deleteMembers', function(req, res, next) {
  var memberID = req.body.user_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
    }

    let query = "DELETE FROM CLUB_MEMBERS WHERE user_id = ?";

    connection.query(query, [memberID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
      }

      res.sendStatus(200);
    });
  });
});

/* Router to create new club events */
router.post('/addEvent', function(req, res, next) {
  var eventName = req.body.event_name;
  var eventMessage = req.body.event_message;
  var eventDate = req.body.event_date;
  var eventLocation = req.body.event_location;
  var clubID = req.body.club_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
    }

    let query = "INSERT INTO EVENTS (event_name, event_message, event_date, event_location, club_id) VALUES (?, ?, ?, ?, ?)";

    connection.query(query, [eventName, eventMessage, eventDate, eventLocation, clubID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
      }

      res.sendStatus(200);
    });
  });
});

/* Router to edit club events */
router.post('/updateEvent', function(req, res, next) {
  var eventName = req.body.event_name;
  var eventMessage = req.body.event_message;
  var eventDate = req.body.event_date;
  var eventLocation = req.body.event_location;
  var eventID = req.body.event_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
    }

    let query = "UPDATE EVENTS SET event_name = ?, event_message = ?, event_date = ? event_location = ? WHERE event_id = ?";

    connection.query(query, [eventName, eventMessage, eventDate, eventLocation, eventID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
      }

      res.sendStatus(200);
    });
  });
});

/* Router to see who has RSVP'd for events */
router.get('/viewEventgoers', function(req, res, next) {
  var eventID = req.body.event_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
    }

    let query = "SELECT EVENTGOERS.participant_id, USERS.first_name, USERS.last_name FROM EVENTGOERS INNER JOIN USERS ON EVENTGOERS.participant_id = USERS.user_id WHERE EVENTGOERS.event_id = ?";

    connection.query(query, [eventID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
      }

      res.sendStatus(200);
    });
  });
});

module.exports = router;