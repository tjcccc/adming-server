var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dq7_little_medal_form', { title: 'DQ7 Little Medal Form' });
});

module.exports = router;
