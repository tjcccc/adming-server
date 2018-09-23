const mongoose = require('mongoose');

const nsGameSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  game_id: Number,
  name_jp: String,
  name_en: String,
  name_cn: String,
  publisher: String,
  genre: String,
  publish_date: Date
},
{
  collection: 'nintendo_switch_games'
});

module.exports = mongoose.model('NSGame', nsGameSchema);
