// TODO
const mongoose = require('mongoose');

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
    type: String
  },
  last_name: {
    type: String
  },
  email: {
    type: String
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


module.exports = {};
