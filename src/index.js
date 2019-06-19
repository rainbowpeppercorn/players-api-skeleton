const express = require('express');
require('./db/mongoose.js'); // Ensure mongoose.js runs and connects to DB
const User = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

// Configure express to automatically parse the incoming json to an object
app.use(express.json());


// Create User
app.post('/api/user', (req, res) => {
  const user = new User(req.body);

  user.save().then(() => {
    res.send(user);
  }).catch((e) => {
    res.status(500).send(e);
  });
});

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

module.exports = {
  Player: {},
  User: {}
};
