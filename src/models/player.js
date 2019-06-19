const mongoose = require('mongoose');
const validator = require('validator');

// Player constructor
const Player = mongoose.model('Player', {
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  rating: {
    type: Number
  },
  handedness: {
    type: String,
    enum: ['right', 'left']
  }
});

module.exports = Player;
