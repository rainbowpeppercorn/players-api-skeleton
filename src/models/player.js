const mongoose = require('mongoose');
const validator = require('validator');
const user = require('./user');

// Create Player Schema
const playerSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true
  },
  handedness: {
    type: String,
    required: true,
    enum: ['right', 'left']
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // create a reference to the User model (as owner)
  }
});

playerSchema.index({first_name: 1, last_name: 1}, {unique: true});



// Player Model
const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
