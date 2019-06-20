const express = require('express');
const router = new express.Router();

router.get('/test', (req, res) => {
  res.send('this is from my new router in another file');
});

module.exports = router;
