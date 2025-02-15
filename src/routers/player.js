const express = require('express');
const Player = require('../models/player');
const auth = require('../middleware/authentication');
const router = new express.Router();

// CREATE A PLAYER
router.post('/api/players', auth, async (req, res) => {
  // Add the owner ID to any new Player
 const player = new Player({
   ...req.body, // ES6 spread operator : copies all props from req.body over to new Player
   created_by: req.user._id
 });

  try {
    await player.save();

    let success;
    if (!player) {
      success = false;
      return res.status(409).send('Unable to create player')
    } else {
      success = true;
    }

    const response = {
      player,
      success
    };

    res.status(201).send(response);
  } catch (e) {
    if (!req.body.first_name || !req.body.last_name || !req.body.rating || !req.body.handedness) {
      return res.status(409).send('A complete Player profile requires a full name, rating, and handedness.');
    }

    res.status(409).send(e.message);
  }
});

// GET ALL PLAYERS (for logged in User only)
router.get('/api/players', auth, async (req, res) => {
  try {
    await req.user.populate('players').execPopulate(); // populate() == mongoose's pseudo-join

    let success;
    if (!req.user.players) {
      success = false;
      return res.status(409).send('An error occurred trying to find players')
    } else {
      success = true;
    }
    
    const response = {
      success,
      players: req.user.players,
    }

    res.send(response);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// GET PLAYER BY ID
router.get('/api/players/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const player = await Player.findOne({ _id: _id, created_by: req.user._id });

    // Check if such a player exists
    if (!player) {
      return res.status(404).send('This player is not recognized in your system');
    }
  
    // If all goes well... get dat player
    res.send(player);

  }  catch (e) {
    res.status(500).send(e.message);
  }
});

// UPDATE ENTIRE PLAYER BY ID
router.put('/api/players/:id', auth, async (req, res) => {

  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!player) {
      return res.status(404).send({ error: 'This player is not recognized in your system' });
    }

    await player.save();

    let success;
    if (!player) {
      success = false;
      return res.status(409).send('Unable to create player')
    } else {
      success = true;
    }

    const response = {
      player,
      success
    };

    res.send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }

});

// UPDATE PARTIAL PLAYER BY ID
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
      return res.status(404).send({ error: 'This player is not recognized in your system' });
    }

    updates.forEach((update) => {
      player[update] = req.body[update];
    });

    await player.save();

    res.send(player);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Delete a Player by ID
router.delete('/api/players/:id', auth, async (req, res) => {
  try {
    const player = await Player.findOneAndDelete({ _id: req.params.id, created_by: req.user._id });

    let success;
    if (!player) {
      success = false;
      return res.status(404).send({ error: 'Cannot delete player at this time' });
    } else {
      success = true;
    }

    const response = {
      player,
      success
    }

    // If successful, send back the deleted player's info
    res.send(response);

  } catch (e) {
    res.status(404).send(e.message);
  }
});

module.exports = router;
