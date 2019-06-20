const mongoose = require('mongoose');
const validator = require('validator');

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
  }
});

// before saving, do some stuff (standard function bc 'this' binding is important) 
userSchema.pre('save', async function (next) {
  const user = this; // just for funsies

  // for new and updated passwords, hash the plaintext 8 rounds
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next(); // call next() to finish the process
});

// User model
const User = mongoose.model('User', userSchema);


module.exports = User;
