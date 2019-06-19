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

// Use async and await to refactor the chaining promises
const updateNameAndCount = async (id, name) => {
  const user = await User.findByIdAndUpdate(id, { first_name: name });
  const count = await User.countDocuments({ first_name: name });
  return count
}

updateNameAndCount('5d0a8262026f46e9f0f867f4', 'Newest').then((count) => {
  console.log(count);
}).catch((e) => {
  console.log(e);
});
