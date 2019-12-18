const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @route         GET api/transactions
// @description   Get all users transactions
// @access        Private
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(transactions);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route         POST api/transactions
// @description   Add new transaction
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
        .isEmpty(),
      check('inOrOut', 'inOrOut is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, amount, category, note, inOrOut } = req.body;

    try {
      const newTransaction = new Transaction({
        name,
        amount,
        category,
        note,
        inOrOut,
        user: req.user.id
      });
      const transaction = await newTransaction.save();
      res.json(transaction);
    } catch (error) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route         PUT api/transactions/:id
// @description   Update transaction
// @access        Private
router.put('/:id', auth, async (req, res) => {
  const { name, amount, category, note, inOrOut } = req.body;

  // build an transaction object

  const transactionFields = {};
  if (name) transactionFields.name = name;
  if (amount) transactionFields.amount = amount;
  if (category) transactionFields.category = category;
  if (note) transactionFields.note = note;
  if (inOrOut) transactionFields.inOrOut = inOrOut;

  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: 'transaction not found' });

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401), json({ msg: 'not authorised' });
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        $set: transactionFields
      },
      {
        new: true
      }
    );
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route         DELETE api/transactions/:id
// @description   Update transaction
// @access        Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let transactions = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: 'transaction not found' });

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401), json({ msg: 'not authorised' });
    }

    await Transaction.findByIdAndRemove(req.params.id);

    res.json({ msg: 'transaction deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
