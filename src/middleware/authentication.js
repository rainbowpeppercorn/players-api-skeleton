const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  console.log('top of the mw');
  try {
    if (!req.header('Authorization')) {
      console.log('inside if statement mw');
      return res.status(403).send('Auth token not found');
    }
    console.log('inside middleware');
    const token = req.header('Authorization').replace('Bearer ', ''); // Remove Bearer from the front of the jwt string
    const decoded = jwt.verify(token, 'secretcodesupersecret'); // decoded will have the _id property

    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    console.log('after user middleware');

    if(!user || !token) {
      throw new Error();
    }

    // If all goes well...
    req.token = token; // Add the token toooo
    req.user = user; // Add the user on for the route handler 
    next();

  } catch (e) {
    res.status(401).send({ error: 'Please authenticate yourself.'});
  }
};

module.exports = auth;
