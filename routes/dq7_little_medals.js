var express = require('express');
var router = express.Router();

const pgPromise = require('pg-promise')();
const dbConfig = require('.././db-config');
const dbPath = 'postgres://' + dbConfig.pgsql.user + ':' + dbConfig.pgsql.password + '@' + dbConfig.pgsql.host + '/' + dbConfig.mongodb.database;
const database = pgPromise(dbPath);
const table = 'dq7_little_medals';
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', function(req, res, next) {
  res.render('dq7_little_medals', { title: 'DQ7 Little Medal' });
});

// Create
router.post('/create', function(req, res, next) {
  // res.send('respond with a resource');
  const values = {
    orderId: req.body.orderId,
    place: req.body.place,
    era: req.body.era,
    specificMethod: req.body.specificMethod,
    isFound: req.body.isFound === 'on',
    memo: req.body.memo
  };
  const sqlQuery = 'insert into ' + table + '(order_id, place, era, specific_method, is_found, memo) values(${orderId}, ${place}, ${era}, ${specificMethod}, ${isFound}, ${memo})';
  // console.log(sqlQuery, values);
  database.query(sqlQuery, values)
    .then(function(data) {
      console.log('DATA: ', data);
      res.status(200).json(data);
    })
    .catch(function(error) {
      console.log('ERROR: ', error);
    });
});

// Read All
router.get('/all', function(req, res, next) {
  // res.send('respond with a resource');

  const sqlQuery = 'select * from ' + table + ' ORDER BY id ASC';
  database.query(sqlQuery)
    .then(function(data) {
      console.log('DATA: ', data);
      res.status(200).json(data);
    })
    .catch(function(error) {
      console.log('ERROR: ', error);
    });
});

// Read
router.get('/:id', function(req, res, next) {
  // res.send('respond with a resource');
  const id = req.params.id;
  const sqlQuery = 'select * from ' + table + ' WHERE id = ' + id;
  database.one(sqlQuery)
    .then(function(data) {
      console.log('DATA: ', data);
      res.status(200).json(data);
    })
    .catch(function(error) {
      console.log('ERROR: ', error);
    });
});

router.get('/?orderid=:id', function(req, res, next) {
  // res.send('respond with a resource');
  const id = req.params.id;
  const sqlQuery = 'select * from ' + table + ' WHERE id = ' + id;
  database.one(sqlQuery)
    .then(function(data) {
      console.log('DATA: ', data);
      res.status(200).json(data);
    })
    .catch(function(error) {
      console.log('ERROR: ', error);
    });
});

// Update


// Delete

module.exports = router;
