const express = require('express');
const Player = require('../models/player');
const auth = require('../middleware/authentication');
const router = new express.Router();

// Create a Player
router.post('/api/players', auth, async (req, res) => {
  console.log('1');
  // Add the owner ID to any new Player
 const player = new Player({
   ...req.body, // ES6 spread operator : copies all props from body over to new Player
   created_by: req.user._id
 });

 console.log('2');

  try {
    console.log('3');
    await player.save();
    console.log(player);

    const response = {
      player,
      success: true
    }

    res.status(201).send(response);
  } catch (e) {
    console.log('5');
    if (!req.body.first_name || !req.body.last_name || !req.body.rating || !req.body.handedness) {
      return res.status(409).send('Please provide all Player info.');
    }
    console.log('6');

    res.status(409).send(e);
  }
});

// Get all Players (for logged in User only)
router.get('/api/players', auth, async (req, res) => {
  console.log('1');
  try {
    await req.user.populate('players').execPopulate();

    const response = {
      success: true,
      players: req.user.players,
    }


    res.send(response);
  } catch (e) {
    console.log('3');
    res.status(500).send();
  }
});

// Get (Read) single Player by ID
router.get('/api/players/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {

    const player = await Player.findOne({ _id: _id, created_by: req.user._id });

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
router.patch('/api/players/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body); // Convert req.body from an object to an array of properties
  const allowedUpdates = ['first_name', 'last_name', 'rating', 'handedness'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'User not permitted to make these updates on a Player' });
  }

  try {

    const player = await Player.findOne({ _id: req.params.id, created_by: req.user._id });
  
    if (!player) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      player[update] = req.body[update];
    });

    await player.save(); // this is where the middleware runs (can only update valid properties)

    res.send(player);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete a Player by ID
router.delete('/api/players/:id', auth, async (req, res) => {
  try {
    console.log('1');

    const player = await Player.findOneAndDelete({ _id: req.params.id, created_by: req.user._id });
    console.log(player);

    if (!player) {
      return res.status(404).send();
    }


    // If successful, send back the deleted player's info
    res.send(player);

  } catch (e) {
    res.status(404).send('player does not exist');
  }
});

module.exports = router;
