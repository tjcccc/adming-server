var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const dbConfig = require('.././db-config');
const bodyParser = require('body-parser');

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
  console.log('Trying to add a new game console...');

  const consoleName = req.body.consoleName;
  const manufacturer = req.body.manufacturer;

  const queryString = 'INSERT INTO game_consoles (console_name, manufacturer) VALUES (?, ?)';
  mysqlConnection.query(queryString, [consoleName, manufacturer], (error, results, fields) => {
    if (error) {
      console.log('Failed to insert new console: ' + error);
      res.sendStatus(500);
      return;
    }
    console.log('Inserted a new console with id: ', results.insertedId);
    res.end();
  });
});

router.get('/all', (req, res) => {
  const queryString = 'SELECT * FROM game_consoles';
  mysqlConnection.query(queryString, (error, results, fields) => {
    if (error) {
      console.log('Failed to query for game_consoles: ' + error);
      res.sendStatus(500);
      return;
    }
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  console.log('Fetching game console with id: ' + req.params.id);

  const consoleId = req.params.id;
  const queryString = 'SELECT * FROM game_consoles WHERE id = ?';
  mysqlConnection.query(queryString, [consoleId], (error, results, fields) => {

    if (error) {
      console.log('Failed to query for game_consoles: ' + error);
      res.sendStatus(500);
      return;
    }

    console.log('Fetched.');

    res.json(results);
  });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
