var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mysql = require('mysql');
const dbConfig = require('./db-config');

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const mysqlConnection = mysql.createConnection({
  host: dbConfig.mysql.host,
  user: dbConfig.mysql.user,
  password: dbConfig.mysql.password,
  database: dbConfig.mysql.database,
  insecureAuth : true
});

mysqlConnection.connect((err) => {
  if (err) {
    throw err;
  }
  console.debug('MySQL Connected...');
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var formRouter = require('./routes/form');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/form', formRouter);

app.post('/user_create', (req, res) => {
  console.log('Trying to create a new user...');

  console.log('Username: ' + req.body.username);

  const username = req.body.username;

  const rawPassword = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const password = bcrypt.hashSync(rawPassword, salt);

  const queryString = 'INSERT INTO users (username, password) VALUES (?, ?)'
  mysqlConnection.query(queryString, [username, password], (err, results, fields) => {
    if (err) {
      console.log('Failed to insert new user: ' + err);
      res.sendStatus(500);
      return;
    }

    console.log('Inserted a new user with id: ', results.insertedId);
    res.end();
  });

});

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/user/:id', (req, res) => {
  console.log('Fetching user with id: ' + req.params.id);

  const userId = req.param.id;
  const queryString = 'SELECT * FROM users WHERE id = ?';
  mysqlConnection.query(queryString, [userId], (err, rows, fields) => {

    if (err) {
      console.log('Failed to query for users: ' + err);
      res.sendStatus(500);
      return;
    }

    console.log('Fetched.');

    console.log(rows);

    // const users = rows.map((row) => {
    //   return { name: row.name };
    // });

    res.json(rows);
  });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
