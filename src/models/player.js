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

//TODO: START HERE
// Ensure Player name is unique (first/last combo)
playerSchema.pre('save', async function (next) {
  const player = this;

// Compare Player first/last to all existing Players
// forEach method on User's player array

  next();
});


// Player Model
const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
