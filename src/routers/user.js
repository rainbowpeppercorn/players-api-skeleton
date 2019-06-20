const express = require('express');
const User = require('../models/user');
const router = new express.Router();

// Public routes: Create User, Login User (all others require authentication)

// Create a User
router.post('/api/user', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    // If all goes well...
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Login a User
router.post('/api/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password); // BYO function (in user.js models)
    
    const token = await user.generateAuthToken();
    
    res.send({ user, token });
  }  catch (e) {
    res.status(400).send();
  }
});

// Get all Users stored in DB (array)
router.get('/api/user', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});

// Get individual User by ID
router.get('/api/user/:id', async (req, res) => {
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
router.patch('/api/user/:id', async (req, res) => {
  // Error handling: User an only update value if property is allowed 
  const updates = Object.keys(req.body); // Convert req.body from an object to an array of its properties
  const allowedUpdates = ['first_name', 'last_name', 'email', 'password',];
  const isValidOperation = updates.every((update) => { // every property must return true
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'User not permitted to make these updates' });
  }

  // Then do the update
  try {

    const user = await User.findById(req.params.id); // .findByIdAndUpdate bypasses middleware

    updates.forEach((update) => {
      user[update] = req.body[update]; // use bracket notation bc the data from user is dynamic 
    });

    await user.save() // this is where middleware runs

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(400).send();
  }

});

// Delete a User by ID
router.delete('/api/user/:id', async (req, res) => {
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

module.exports = router;
