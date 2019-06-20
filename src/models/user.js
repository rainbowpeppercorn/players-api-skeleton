const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain the word password');
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});


// Generate JWT
// 'Methods' --> accessible on instances; aka Instance Methods
userSchema.methods.generateAuthToken = async function () {
  const user = this; // Just for funsies
  const token = jwt.sign({ _id: user._id.toString() }, 'secretcodesupersecret');

  // Add user's token to the user object and save to DB
  user.tokens = user.tokens.concat({ token: token });
  await user.save();

  return token;
}


// Verify a user by their email and password
// 'Static" methods --> accessible on models; aka Model Methods
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login'); 
  }

  // If the email matches successfully, compare the plaintext PW w/ hashed stored PW
  const isMatch = await bcrypt.compare(password, user.password); 

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  // If both email and password match up, return the User
  return user;
}

// Before saving, hash the plaintext password (standard function bc 'this' binding is important) 
userSchema.pre('save', async function (next) {
  const user = this; // Just for funsies

  // For new and updated passwords, hash the plaintext 8 rounds
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next(); // Call next() to finish the process
});

// User model
const User = mongoose.model('User', userSchema);


module.exports = User;
