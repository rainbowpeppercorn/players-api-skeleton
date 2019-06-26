const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    // Check for authentication token 
    if (!req.header('Authorization')) {
      return res.status(403).send('Auth token not found');
    }

    const token = req.header('Authorization').replace('Bearer ', ''); // Remove Bearer from the front of the jwt string
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decoded will have the _id property ()
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    // Check both user and token exist
    if(!user || !token) {
      throw new Error('Either user or token not found');
    }

    // If all goes well...
    req.token = token; // Set token property 
    req.user = user; // Set user property  
    next();

  } catch (e) {
    res.status(401).send({ error: 'Please authenticate yourself.'});
  }
};

module.exports = auth;
