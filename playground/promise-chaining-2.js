require('../src/db/mongoose');
const Player = require('../src/models/player');

Player.findByIdAndDelete('5d0a8262026f46e9f0f867f5').then((player) => {
  console.log(player);
  return Player.countDocuments({ last_name: 'K' });
}).then((result) => {
  console.log(result)
}).catch((e) => {
  console.log(e);
});

const deletePlayerAndCount = async (id) => {
  const player = await Player.findByIdAndDelete(id);
  const count = await Player.countDocuments({ last_name: 'K' });
  return count;
};

deletePlayerAndCount('5d0aa5a81f67b2f814cc11f7').then((count) => {
  console.log(count);
}).catch((e) => {
  console.log(e);
});
