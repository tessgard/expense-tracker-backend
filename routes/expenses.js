const express = require('express');
const router = express.Router();

// @route         GET api/expenses
// @description   Get all users expenses
// @access        Private
router.get('/', (req, res) => {
  res.send('get all expenses');
});

// @route         POST api/expenses
// @description   Add new expense
// @access        Private
router.post('/', (req, res) => {
  res.send('add expense');
});

// @route         PUT api/expenses/:id
// @description   Update expense
// @access        Private
router.put('/:id', (req, res) => {
  res.send('update expense');
});

// @route         DELETE api/expenses/:id
// @description   Update expense
// @access        Private
router.delete('/:id', (req, res) => {
  res.send('delete expense');
});

module.exports = router;
