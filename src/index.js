const express = require('express');
require('./db/mongoose.js'); // Ensure mongoose.js runs and connects to DB
const User = require('./models/user');
const Player = require('./models/player');
const userRouter = require('./routers/user');

const app = express();
const port = process.env.PORT || 3000;

// Configure express to automatically parse the incoming json to an object
app.use(express.json());
app.use(userRouter);


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
