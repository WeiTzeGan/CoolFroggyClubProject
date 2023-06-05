var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.use('/', function(req, res, next){
  // if not logged in or
  // NOT logged in as club manager
  if (!('user' in req.session) || !('manager_id' in req.session.user)){
    console.log("Not logged in OR not logged in as club manager");
    res.sendStatus(403);
  }else{
    next();
  }
});

/* Route to view club members */
router.get('/viewMembers', function(req, res, next) {
  var clubID = req.body.club_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT CLUB_MEMBERS.user_id, USERS.first_name, USERS.last_name, USERS.email, USERS.mobile FROM CLUB_MEMBERS INNER JOIN USERS ON CLUB_MEMBERS.user_id = USERS.user_id WHERE CLUB_MEMBERS.club_id = ?";

    connection.query(query, [clubID], function(error, rows, fields) {
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

// view events that the club manager is managing

/* Router to remove club members */
router.delete('/deleteMembers', function(req, res, next) {
  var memberID = req.body.user_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "DELETE FROM CLUB_MEMBERS WHERE user_id = ?";

    connection.query(query, [memberID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

/* Route to post updates to members */
router.post('/newAnnouncement', function(req, res, next) {
  var postTitle = req.body.title;
  var postMessage = req.body.post_message;
  var privateMessage = req.body.private_message;
  var clubID = req.body.club_id;

  // To check if announcement title already exists
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM ANNOUNCEMENTS WHERE title = ?";

    connection.query(query, [postTitle], function(error, rows, fields) {
      console.log("Announcements was checked");
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        console.log("Announcement title already exists");
        res.sendStatus(403);
        return;
      }

      // If passes above, add to announcements table
      req.pool.getConnection(function(cerr, connection) {
        if (cerr) {
          res.sendStatus(500);
          return;
        }

        let query2 = "INSERT INTO ANNOUNCEMENTS (title, post_message, private_message, club_id) VALUES (?, ?, ?, ?)";

        connection.query(query2, [postTitle, postMessage, privateMessage, clubID], function(error, rows, fields) {
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

/* Router to create new club events */
router.post('/addEvent', function(req, res, next) {
  var eventName = req.body.event_name;
  var eventMessage = req.body.event_message;
  var eventDate = req.body.event_date;
  var eventLocation = req.body.event_location;
  var clubID = req.body.club_id;

  // To check if event name already exists
  req.pool.getConnection(function(err, connection) {
    if (err) {
      console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM EVENTS WHERE event_name = ? AND (event_location = ? OR event_date = ?)";

    connection.query(query, [eventName, eventLocation, eventDate], function(error, rows, fields) {
      connection.release();

      if (error) {
        console.log("First query error");
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        console.log("Event name already exists, or event location already booked at this time");
        res.sendStatus(403);
        return;
      }

      // If passes all above, insert into events table
      req.pool.getConnection(function(cerr, connection) {
        if (cerr) {
          console.log("Second query error");
          res.sendStatus(500);
          return;
        }

        let query2 = "INSERT INTO EVENTS (event_name, event_message, event_date, event_location, club_id) VALUES (?, ?, ?, ?, ?)";

        connection.query(query2, [eventName, eventMessage, eventDate, eventLocation, clubID], function(error, rows, fields) {
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
      return;
    }

    let query = "UPDATE EVENTS SET event_name = ?, event_message = ?, event_date = ? event_location = ? WHERE event_id = ?";

    connection.query(query, [eventName, eventMessage, eventDate, eventLocation, eventID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
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
      return;
    }

    let query = "SELECT EVENTGOERS.participant_id, USERS.first_name, USERS.last_name FROM EVENTGOERS INNER JOIN USERS ON EVENTGOERS.participant_id = USERS.user_id WHERE EVENTGOERS.event_id = ?";

    connection.query(query, [eventID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

/* Route to make new club */
router.post('/addClubRequest', function(req, res, next) {
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

        let query2 = "INSERT INTO PENDING_CLUBS (club_name, club_description, club_manager_id, phone, email) VALUES (?, ?, ?, ?, ?)";

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