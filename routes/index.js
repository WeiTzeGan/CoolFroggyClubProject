var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/admin', function(req, res, next){

  req.pool.getConnection(function(cerr, connection){

    if (cerr){
      console.log("Connection error");
      res.sendStatus(500);
    }

    let query = "SELECT * FROM ADMINS";
    connection.query(query, function(qerr, rows, fields){
      connection.release();

      if (qerr){
        console.log("Query error");
        res.sendStatus(500);
      }

      console.log(JSON.stringify(rows));

    });
  });

});
module.exports = router;
