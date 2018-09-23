var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('ns_game_form', { title: 'Nintendo Switch Game Form' });
});

module.exports = router;
