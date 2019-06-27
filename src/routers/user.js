const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/authentication');
const router = new express.Router();

// Public routes: Create User, Login User (all others require auth)

// CREATE A USER
router.post('/api/user', async (req, res) => {
  const user = new User(req.body);

  try {
    if (req.body.confirm_password !== req.body.password) {
      return res.status(409).send({ error: 'Passwords must match' });
    }

    await user.save();
  
    // Generate JWT
    const token = await user.generateAuthToken();

    user.password = 'Hidden'; // Even tho it's already hashed
    user.confirm_password = 'Hidden';

    const response = {
      user,
      token,
      success: true
    };

    // If all goes well...
    res.status(201).send(response);

  } catch (e) {
    if (!req.body.first_name || !req.body.last_name || !req.body.email) {
      return res.status(409).send({ error: 'Please enter your full name and email address' });
    }
    res.status(409).send(e.message);
  }
});

// LOGIN A USER
router.post('/api/login', async (req, res) => {
  try {
    // Verify user exists (BYO Method)
    const user = await User.findByCredentials(req.body.email, req.body.password);
    
    // Generate JWT (BYO Method)
    const token = await user.generateAuthToken();

    user.password = 'Hidden'; // Even tho it's already hashed

    const response = {
      user,
      token,
      success: true
    };
    
    res.send(response);
  }  catch (e) {
    res.status(401).send(e.message);
  }
});

// LOGOUT USER FROM CURRENT SESSION
router.post('/api/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      // Save a filtered version of the token array
      return token.token !== req.token;
    });

    await req.user.save();

    // If all goes well...
    res.send('Thanks for playing! You have been logged out of your session.');
  } catch (e) {
    res.status(500).send();
  }
});

// LOGOUT USER FROM ALL SESSIONS
router.post('/api/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []; // Clear out the tokens array
    await req.user.save(); // Save the token-less User
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// GET CURRENT USER INFO
router.get('/api/user/me', auth, async (req, res) => {
  res.send(req.user);
});


// UPDATE ENTIRE USER
router.put('/api/user/:id', auth, async (req, res) => {

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).send({ error: 'Cannot update User profile at this time' });
    }

    await user.save();

    const response = {
      user,
      success: true
    };

    res.send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }

});


// UPDATE PARTIAL USER INFO
router.patch('/api/user/me', auth, async (req, res) => {
  // Error handling: User can only update value if property is allowed 
  const updates = Object.keys(req.body); // Convert req.body from an object to an array of its properties
  const allowedUpdates = ['first_name', 'last_name', 'email', 'password',];
  const isValidOperation = updates.every((update) => { // every property must return true
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'User not permitted to make these updates' });
  }

  // Do the update
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update]; // use bracket notation bc dynamic variables
    });

    const updatedUser = await req.user.save();

    const response = {
      user: updatedUser,
      success: true
    };

    res.send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }

});

// DELETE A USER (I.E. YOURSELF)
router.delete('/api/user/me', auth, async (req, res) => {
  try {
    const deletedUser = await req.user.remove();

    const response = {
      user: deletedUser,
      success: true
    }

    // Send the deleted User's info back if successful
    res.send(response); // was req.user
  } catch (e) {
    res.status(500).send('Cannot delete your profile at this time');
  }
});

module.exports = router;
