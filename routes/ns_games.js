var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const dbConfig = require('.././db-config');

const NSGame = require('../models/ns-game');

const dbPath = 'mongodb://' + dbConfig.mongodb.user + ':' + dbConfig.mongodb.password + '@' + dbConfig.mongodb.host + '/' + dbConfig.mongodb.database;
console.log('db path: ' + dbPath);
mongoose.connect(dbPath, {
  useNewUrlParser: true
});

// Create
router.post('/create', (req, res, next) => {
  const game = new NSGame({
    _id: new mongoose.Types.ObjectId(),
    game_id: req.body.gameId,
    name_jp: req.body.nameJP,
    name_en: req.body.nameEN,
    name_cn: req.body.nameCN,
    publisher: req.body.publisher,
    genre: req.body.genre,
    publish_date: req.body.publishDate
  });
  game
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Handling POST requests to /ns_games',
        createdProduct: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err })
    });
});

// Get All
router.get('/all', (req, res, next) => {
  const id = req.params.game_id;
  NSGame
    .find()
    .exec()
    .then(doc => {
      console.log('Form database', doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: 'No valid entry found for provided Id.' });
      }

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Read
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  NSGame
    .find({ game_id : id })
    .exec()
    .then(docs => {
      console.log('Form database', docs);
      if (docs.length >= 0) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({ message: 'No valid entry found for provided Id.' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Update
router.patch('/:id', (req, res, next) => {
  const id = req.params.id;

  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  NSGame
    .update({ "game_id" : id }, { $set: updateOps })
    .exec()
    .then(doc => {
      console.log(result);
      res.status(200).json(doc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


// Delete
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  NSGame
    .remove({ "game_id" : id })
    .exec()
    .then(doc => {
      res.status(200).json(doc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


module.exports = router;
