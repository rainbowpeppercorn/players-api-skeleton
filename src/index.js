require('dotenv').config();

const express = require('express');
require('./db/mongoose.js'); // Ensure mongoose.js runs and connects to DB
const userRouter = require('./routers/user');
const playerRouter = require('./routers/player');


// Create the express app and get it up and running
const app = express();
const port = process.env.PORT || 3000;

// Configure express to automatically parse the incoming json to an object
app.use(express.json());

// Use separate routers for each bundle of joy 
app.use(userRouter);
app.use(playerRouter);

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

module.exports = app;
