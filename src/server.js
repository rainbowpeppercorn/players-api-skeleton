// TODO
const mongoose = require('mongoose');
const validator = require('validator');



// User constructor
const User = mongoose.model('User', {
  id: {
    type: String
  },
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
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain the word password');
      }
    }
  }
});

const me = new User({
  id: '1',
  first_name: 'Jenn',
  last_name: 'K',
  email: 'name@email.com',
  password: 'asf'
});

me.save().then(() => {
  console.log(me);
}).catch((error) => {
  console.log('Error', error)
});

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

const player = new Player({
  first_name: 'J',
  last_name: 'K',
  rating: 5,
  handedness: true
});

player.save().then(() => {
  console.log(player);
}).catch((error) => {
  console.log(error);
});


module.exports = {};
