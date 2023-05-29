var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Club managers log in */
router.get('/signin', function(req, res, next) {
    var managerID = req.body.username;
    var managerPassword = req.body.password;

    req.pool.getConnection(function(err, connection) {
      if (err) {
        res.sendStatus(500);
      }

      let query = "SELECT CLUB_MANAGERS.manager_id, USERS.user_password FROM CLUB_MANAGERS INNER JOIN USERS ON CLUB_MANAGERS.manager_id = USERS.user_id WHERE manager_id = ? AND user_password = ?";

      connection.query(query, [managerID, managerPassword], function(error, rows, fields) {
        connection.release();

        if (error) {
          res.sendStatus(500);
        }

        if (rows.length > 0) {
          res.json({
            signedIn: true
          });
        } else {
          res.json({
            signedIn: false
          });
        }

      });
    });
  });


module.exports = router;