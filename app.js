var createerroror = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gameConsolesRouter = require('./routes/game_consoles');
var formRouter = require('./routes/form');
var nsGamesRouter = require('./routes/ns_games');
var nsGameFormRouter = require('./routes/ns_game_form');
var dq7LittleMedalsRouter = require('./routes/dq7_little_medals');
var dq7LittleMedalFormRouter = require('./routes/dq7_little_medal_form');

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
app.use('/game_consoles', gameConsolesRouter);
app.use('/form', formRouter);
app.use('/ns_games', nsGamesRouter);
app.use('/ns_game_form', nsGameFormRouter);
app.use('/dq7_little_medals', dq7LittleMedalsRouter);
app.use('/dq7_little_medal_form', dq7LittleMedalFormRouter);

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
