const mongoose = require('mongoose');

// Connect to database (connectionURL, options object)
mongoose.connect('mongodb://127.0.0.1:27017/players-api', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
