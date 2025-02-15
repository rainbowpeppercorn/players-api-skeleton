const validator = require('validator');
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

// Set strong password criteria
passwordSchema
.is().min(8)
.has().digits()
.has().lowercase()
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'passw0rd', 'Password123', 'password123']);

const customValidation = {
  validatePassword: (value) => {
    if (value.toLowerCase().includes('password')) {
      throw new Error('User password cannot contain the word password');
    }
    if (!passwordSchema.validate(value)) {
      throw new Error('User password must be at least 8 characters, containing both letters and numbers.');
    }

  },
  validateEmail: (value) => {
    if (!validator.isEmail(value)) {
      throw new Error('Please use a valid email address');
    }
  }
}


module.exports = customValidation;
