const express = require('express');
const router = express.Router();

// @route         GET api/auth
// @description   Get logged in user
// @access        Private
router.get('/', (req, res) => {
  res.send('get logged in user');
});

// @route         POST api/auth
// @description   Auth user & get token
// @access        Public
router.get('/', (req, res) => {
  res.send('Log in user');
});

module.exports = router;
