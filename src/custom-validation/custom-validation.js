const customValidation = {
  validatePassword: (value) => {
    if (value.toLowerCase().includes('password')) {
      throw new Error('Password cannot contain the word password');
    }
  },
  validateEmail: ''
}


module.exports = customValidation;
