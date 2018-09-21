var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbConfig = require('.././db-config');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const mysqlConnection = mysql.createConnection({
  host: dbConfig.mysql.host,
  user: dbConfig.mysql.user,
  password: dbConfig.mysql.password,
  database: dbConfig.mysql.database
});

mysqlConnection.connect((error) => {
  if (error) {
    throw error;
  }
  console.debug('MySQL Connected...');
});

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/create', (req, res) => {
  console.log('Trying to create a new user...');

  console.log('Username: ' + req.body.username);

  const username = req.body.username;

  const rawPassword = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const password = bcrypt.hashSync(rawPassword, salt);

  const queryString = 'INSERT INTO users (username, password) VALUES (?, ?)'
  mysqlConnection.query(queryString, [username, password], (error, results, fields) => {
    if (error) {
      console.log('Failed to insert new user: ' + error);
      res.sendStatus(500);
      return;
    }
    console.log('Inserted a new user with id: ', results.insertedId);
    res.end();
  });
});

router.get('/all', (req, res) => {
  const queryString = 'SELECT * FROM users';
  mysqlConnection.query(queryString, (error, results, fields) => {
    if (error) {
      console.log('Failed to query for users: ' + error);
      res.sendStatus(500);
      return;
    }
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  console.log('Fetching user with id: ' + req.params.id);

  const userId = req.params.id;
  console.log(userId);
  const queryString = 'SELECT * FROM users WHERE id = ?';
  mysqlConnection.query(queryString, [userId], (error, results, fields) => {

    if (error) {
      console.log('Failed to query for users: ' + error);
      res.sendStatus(500);
      return;
    }

    console.log('Fetched.');

    console.log(results);

    // const users = results.map((row) => {
    //   return { name: row.name };
    // });

    res.json(results);
  });

});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
