const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'salary', 'freelance', 'investments', 'stocks', 'bitcoin', 'bank', 'other', // income
      'food', 'shopping', 'bills', 'clothing', 'housing', 'transportation', 'entertainment', 'health', 'education', 'other' // expense
    ]
  },
  description: {
    type: String,
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', TransactionSchema);