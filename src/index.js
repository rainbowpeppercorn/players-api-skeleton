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

// Get array of all Users stored in DB
app.get('/api/user', (req, res) => {
  // Returns an array of all users
    User.find({}).then((users) => {
      res.send(users);
    }).catch((e) => {
      res.status(500).send();
    });
});

// Get individual User by ID
app.get('/api/user/:id', (req, res) => {
  const _id = req.params.id;

  User.findById(_id).then((user) => {
    // Check if such a User exists
    if (!user) {
      return res.status(404).send();
    }

    // If all goes well... get dat User
    res.send(user);
  }).catch((e) => {
    // Was getting CastErrors when testing IDs that were not mongoose-approved
    if (e.name === 'CastError') {
      return res.status(404).send();
    }

    res.status(500).send();
  });
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

// Get (Read) all Players
app.get('/api/players', (req, res) => {
  // Returns an array of all players
  Player.find({}).then((tasks) => {
    res.send(tasks);
  }).catch((e) => {
    res.status(500).send();
  });
});

// Get (Read) single Player by ID
app.get('/api/players/:id', (req, res) => {
  const _id = req.params.id;

  Player.findById(_id).then((player) => {
    // Check if such a player exists
    if (!player) {
      return res.status(404).send();
    }

    // If all goes well... get dat player
    res.send(player);
  }).catch((e) => {
    res.status(500).send();
  });
});

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

module.exports = app;
