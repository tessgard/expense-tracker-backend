const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');
const Expense = require('../models/Expense');

// @route         GET api/expenses
// @description   Get all users expenses
// @access        Private
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(expenses);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route         POST api/expenses
// @description   Add new expense
// @access        Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
      check('amount', 'Amount is required')
        .not()
        .isEmpty(),
      check('category', 'Category is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, amount, category, note } = req.body;

    try {
      const newExpense = new Expense({
        name,
        amount,
        category,
        note,
        user: req.user.id
      });
      const expense = await newExpense.save();
      res.json(expense);
    } catch (error) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route         PUT api/expenses/:id
// @description   Update expense
// @access        Private
router.put('/:id', auth, async (req, res) => {
  const { name, amount, category, note } = req.body;

  // build an expense object

  const expenseFields = {};
  if (name) expenseFields.name = name;
  if (amount) expenseFields.amount = amount;
  if (category) expenseFields.category = category;
  if (note) expenseFields.note = note;

  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'expense not found' });

    if (expense.user.toString() !== req.user.id) {
      return res.status(401), json({ msg: 'not authorised' });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        $set: expenseFields
      },
      {
        new: true
      }
    );
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route         DELETE api/expenses/:id
// @description   Update expense
// @access        Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'expense not found' });

    if (expense.user.toString() !== req.user.id) {
      return res.status(401), json({ msg: 'not authorised' });
    }

    await Expense.findByIdAndRemove(req.params.id);

    res.json({ msg: 'expense deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
