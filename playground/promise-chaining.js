require('../src/db/mongoose');
const User = require('../src/models/user');

// arg1: Object ID
// arg2: Object that contains the updates we want to apply

User.findByIdAndUpdate('5d0a8262026f46e9f0f867f4', { first_name: 'New' }).then((user) => {
  console.log(user);
  return User.countDocuments({ first_name: 'New' });
}).then((result) => {
  console.log(result);
}).catch((e) => {
  console.log(e);
});
