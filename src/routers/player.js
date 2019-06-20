const express = require('express');
const Player = require('../models/player');
const auth = require('../middleware/authentication');
const router = new express.Router();

// Create a Player
router.post('/api/players', auth, async (req, res) => {

  // Add the owner ID to any new Player
 const player = new Player({
   ...req.body, // ES6 spread operator : copies all props from body over to new Player
   owner: req.user._id
 });

  try {
    await player.save();
    res.status(201).send(player);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get (Read) an array of all Players
router.get('/api/players', auth, async (req, res) => {
  try {
    await req.user.populate('players').execPopulate();
    res.send(req.user.players);
  } catch (e) {
    res.status(500).send();
  }
});

// Get (Read) single Player by ID
router.get('/api/players/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {

    const player = await Player.findOne({ _id: _id, owner: req.user._id });

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
router.patch('/api/players/:id', async (req, res) => {
  const updates = Object.keys(req.body); // Convert req.body from an object to an array of properties
  const allowedUpdates = ['first_name', 'last_name', 'rating', 'handedness'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'User not permitted to make these updates on a Player' });
  }

  try {

    const player = await Player.findById(req.params.id);

    updates.forEach((update) => {
      player[update] = req.body[update];
    });

    await player.save(); // this is where the middleware runs (can only update valid properties)
  
    if (!player) {
      return res.status(404).send();
    }

    res.send(player);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete a Player by ID
router.delete('/api/players/:id', async (req, res) => {
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

module.exports = router;
