const mongoose = require('mongoose');
const validator = require('validator');

// Player constructor
const Player = mongoose.model('Player', {
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
  },
  handedness: {
    type: String,
    enum: ['right', 'left']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // create a reference to the User model (as owner)
  }
});

module.exports = Player;
