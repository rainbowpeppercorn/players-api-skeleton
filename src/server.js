// TODO
const mongoose = require('mongoose');
const validator = require('validator');

// Connect to database (connectionURL, options object)
mongoose.connect('mongodb://127.0.0.1:27017/players-api', {
  useNewUrlParser: true,
  useCreateIndex: true
});

// User constructor
const User = mongoose.model('User', {
  id: {
    type: String
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  }
});

const me = new User({
  id: '1',
  first_name: 'Jenn',
  last_name: 'K',
  email: 'name@email.com'
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
    type: Boolean
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
