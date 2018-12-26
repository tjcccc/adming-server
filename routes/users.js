var express = require('express');
var router = express.Router();
var logger = require('morgan');

const mysql = require('mysql');
const dbConfig = require('.././db-config');
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const moment = require('moment');

const mysqlConnection = mysql.createConnection({
  host: dbConfig.mysql.host,
  port: dbConfig.mysql.port,
  user: dbConfig.mysql.user,
  password: dbConfig.mysql.password,
  database: dbConfig.mysql.database
});

mysqlConnection.connect((error) => {
  if (error) {
    throw error;
  }
  logger.log('MySQL Connected...');
});

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (req, res) => {
  logger.log('Trying to create a new user...');

  logger.log('Username: ' + req.body.name);

  const id = uuid();

  const name = req.body.name;
  const level = 0;
  const state = 0;
  const email = req.body.email;
  const createTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

  const rawPassword = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const password = bcrypt.hashSync(rawPassword, salt);

  const queryString = 'INSERT INTO users (id, name, password, level, state, create_time, email) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)';
  mysqlConnection.query(queryString, [id, name, password, level, state, createTime, email], (error, results, fields) => {
    if (error) {
      console.log('Failed to insert new user: ' + error);
      res.sendStatus(500);
      return;
    }
    console.log('Inserted a new user with id: ', results.insertId);
    res.end();
  });
});

router.get('/', (req, res) => {
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
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
