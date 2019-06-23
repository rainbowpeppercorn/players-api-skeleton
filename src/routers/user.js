const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/authentication');
const router = new express.Router();

// Public routes: Create User, Login User (all others require auth)

// Create a User
router.post('/api/user', async (req, res) => {
  const user = new User(req.body);

  try {

    if (req.body.confirm_password !== req.body.password) {
      return res.status(409).send();
    }

    await user.save();
  
    // Generate JWT
    const token = await user.generateAuthToken();

    const response = {
      user,
      token,
      success: true
    }

    // If all goes well...
    res.status(201).send(response);

  } catch (e) {

    if (!req.body.first_name || !req.body.last_name || !req.body.email) {
      return res.status(409).send('Must have full name and email');
    }
    res.status(409).send('Something happened in catch block');
  }
});

// Login a User
router.post('/api/login', async (req, res) => {
  try {
    // Find user; BYO function (in user.js models)
    const user = await User.findByCredentials(req.body.email, req.body.password);
    
    // Generate JWT
    const token = await user.generateAuthToken();

    const response = {
      user,
      token,
      success: true
    }
    
    res.send(response);
  }  catch (e) {
    res.status(401).send();
  }
});

// Logout User (from current session)
router.post('/api/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      // Save a filtered version of the token array
      return token.token !== req.token;
    });

    await req.user.save();

    // If all goes well...
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// Log out of all sessions
router.post('/api/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []; // Clear out the tokens array
    await req.user.save(); // Save the token-less User
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// Get profile for current (logged in) User
router.get('/api/user/me', auth, async (req, res) => {
  res.send(req.user);
});


// Update User 
router.put('/api/user/:id', auth, async (req, res) => {

  try {
    console.log('1')
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    console.log('2')
    console.log(user)

    if (!user) {
      console.log('3')
      return res.status(404).send();
    }

    await req.user.save()

    console.log('4')

    const response = {
      user,
      success: true
    }
    console.log(response)
    res.send(response);
  } catch (e) {
    console.log('5');

    res.status(400).send(e);
  }

});


// Update your own User profile
router.patch('/api/user/me', auth, async (req, res) => {
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
    updates.forEach((update) => {
      req.user[update] = req.body[update]; // use bracket notation bc the data from user is dynamic 
    });

    await req.user.save() // this is where middleware runs

    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }

});

// Delete a User by ID
router.delete('/api/user/me', auth, async (req, res) => {
  try {
    await req.user.remove();

    // Send the deleted User's info back if successful
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
