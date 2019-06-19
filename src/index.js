const express = require('express');
require('./db/mongoose.js'); // Ensure mongoose.js runs and connects to DB
const User = require('./models/user');
const Player = require('./models/player');

const app = express();
const port = process.env.PORT || 3000;

// Configure express to automatically parse the incoming json to an object
app.use(express.json());


// Create a User
app.post('/api/user', (req, res) => {
  const user = new User(req.body);

  user.save().then(() => {
    res.status(201).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// Get all Users
app.get('/', () => {

});

// Create a Player
app.post('/api/players', (req, res) => {
  const player = new Player(req.body)

  player.save().then(() => {
    res.status(201).send(player);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

module.exports = app;
