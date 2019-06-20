const express = require('express');
require('./db/mongoose.js'); // Ensure mongoose.js runs and connects to DB
const User = require('./models/user');
const Player = require('./models/player');

const app = express();
const port = process.env.PORT || 3000;

// Configure express to automatically parse the incoming json to an object
app.use(express.json());


// Create a User
app.post('/api/user', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    // If all goes well...
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get array of all Users stored in DB
app.get('/api/user', async (req, res) => {
  try {
    const users = await User.find({});
    
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});

// Get individual User by ID
app.get('/api/user/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    // Check if such a User exists
    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    // Was getting CastErrors when testing IDs that were not mongoose-approved
    if (e.name === 'CastError') {
      return res.status(404).send();
    }

    res.status(500).send();
  }
});

// Update User by ID
app.patch('/api/user/:id', async (req, res) => {
  // Error handling: User an only update value if property is allowed 
  const updates = Object.keys(req.body); // Convert req.body from an object to an array of properties
  const allowedUpdates = ['first_name', 'last_name', 'email', 'password',];
  const isValidOperation = updates.every((update) => { // every property must return true
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'User not permitted to make these updates' });
  }

  // Then do the update
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(400).send();
  }

});

// Delete a User by ID
app.delete('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send()
    }

    // Send the deleted User's info back if successful
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

// Create a Player
app.post('/api/players', async (req, res) => {
  const player = new Player(req.body)

  try {
    await player.save();
    res.status(201).send(player);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get (Read) an array of all Players
app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find({});
    res.send(players);
  } catch (e) {
    res.status(500).send();
  }
});

// Get (Read) single Player by ID
app.get('/api/players/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const player = await Player.findById(_id);

    // Check if such a player exists
    if (!player) {
      return res.status(404).send();
    }
  
    // If all goes well... get dat player
    res.send(player);

  }  catch (e) {
    res.status(500).send();
  }
});

// Update a Player by ID
app.patch('/api/players/:id', async (req, res) => {
  const updates = Object.keys(req.body); // Convert req.body from an object to an array of properties
  const allowedUpdates = ['first_name', 'last_name', 'rating', 'handedness'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'User not permitted to make these updates on a Player' });
  }

  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  
    if (!player) {
      return res.status(404).send();
    }

    res.send(player);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete a Player by ID
app.delete('/api/players/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      res.status(404).send();
    }

    // If successful, send back the deleted player's info
    res.send(player);

  } catch (e) {
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

module.exports = app;
