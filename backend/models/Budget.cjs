const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'food', 'shopping', 'bills', 'clothing', 'housing', 'transportation', 
      'entertainment', 'health', 'education', 'other'
    ]
  },
  limit: {
    type: Number,
    required: [true, 'Please add a spending limit']
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'monthly'
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Budget', BudgetSchema);