const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Configure express to automatically parse the incoming json to an object
app.use(express.json());



// Create User
app.post('/api/user', (req, res) => {
  console.log(req.body);
  res.send('testing')
});

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

module.exports = {
  Player: {},
  User: {}
};
