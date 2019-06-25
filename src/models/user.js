const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Player = require('./player')
const customValidation = require ('../custom-validation/custom-validation');

// create Schema w/ object that defines all properties for User
// separate from model to take advantage of middleware functionality 
const userSchema = new mongoose.Schema({
  id: {
    type: String
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
    validate(value) {
      customValidation.validatePassword(value);
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

// Create a Virtual Property - relationship between User and Player (not stored in DB, just for Mongoose)
userSchema.virtual('players', { 
  // set up virtual attributes
  ref: 'Player',
  localField: '_id', 
  foreignField: 'created_by' // Name of the field on the Player that creates relationship
});

// 'Methods' --> accessible on instances (user); aka Instance Methods

// Generate JWT
userSchema.methods.generateAuthToken = async function () {
  const user = this; 
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  // Add user's token to the user object and save to DB
  user.tokens = user.tokens.concat({ token: token });

  await user.save();
  return token;
};


// Verify a user by their email and password
// 'Static" methods --> accessible on models (User); aka Model Methods
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Login credentials are not valid')
  }

  // If user exists, compare the plaintext PW w/ hashed stored PW
  const isMatch = await bcrypt.compare(password, user.password); 

  if (!isMatch) {
    throw new Error('Login credentials are invalid - Unable to login');
  }

  // If all goes well...
  return user;
};

// Hash the plaintext password before saving (standard function bc 'this' binding is important) 
userSchema.pre('save', async function (next) {
  const user = this; 

  // For new and updated passwords, hash the plaintext 8 rounds
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next(); 
});

// Delete all Players when their User is removed
userSchema.pre('remove', async function (next) {
  const user = this;
  await Player.deleteMany({
    created_by: user._id
  });

  next();
});

// User model
const User = mongoose.model('User', userSchema);

module.exports = User;
