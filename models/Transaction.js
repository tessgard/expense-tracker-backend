const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  inOrOut: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('transaction', TransactionSchema);
