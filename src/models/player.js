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
  full_name: {
    type: String
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // create a reference to the User model (as owner)
  }
});

// // Check for duplicate players 
// playerSchema.methods.verifyUniquePlayer = async function () {
//   const player = this;

// }


// Ensure Player name is unique (first/last combo)
// playerSchema.pre('save', async function (next) {
//   const player = this;



//   next();
// });


// Player Model
const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
