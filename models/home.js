const mongoose = require('mongoose');
const Favourite = require('./favourite');

const homeSchema = new mongoose.Schema({
  houseName : {type: String, required: true},
  price: {type: Number, required: true},
  location: {type: String, required: true},
  rating: {type: Number, required: true},
  photo: String,
  description: String,
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

  

module.exports = mongoose.model("Home", homeSchema);