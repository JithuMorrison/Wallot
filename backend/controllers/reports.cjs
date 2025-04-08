const Transaction = require('../models/Transaction');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const moment = require('moment');

// @desc    Get monthly summary
// @route   GET /api/reports/monthly
// @access  Private
exports.getMonthlySummary = asyncHandler(async (req, res, next) => {
  const startOfMonth = moment().startOf('month').toDate();
  const endOfMonth = moment().endOf('month').toDate();

  const transactions = await Transaction.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(req.user.id),
        date: { $gte: startOfMonth, $lte: endOfMonth }
      }
    },
    {
      $group: {
        _id: {
          type: '$type',
          category: '$category'
        },
        total: { $sum: '$amount' }
      }
    },
    {
      $sort: { '_id.type': 1, total: -1 }
    }
  ]);

  // Format the data for frontend
  const income = transactions.filter(t => t._id.type === 'income');
  const expenses = transactions.filter(t => t._id.type === 'expense');

  res.status(200).json({
    success: true,
    data: {
      income,
      expenses
    }
  });
});

// @desc    Get yearly summary
// @route   GET /api/reports/yearly
// @access  Private
exports.getYearlySummary = asyncHandler(async (req, res, next) => {
  const startOfYear = moment().startOf('year').toDate();
  const endOfYear = moment().endOf('year').toDate();

  const transactions = await Transaction.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(req.user.id),
        date: { $gte: startOfYear, $lte: endOfYear }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          type: '$type'
        },
        total: { $sum: '$amount' }
      }
    },
    {
      $sort: { '_id.month': 1, '_id.type': 1 }
    }
  ]);

  // Format the data for frontend
  const result = Array(12).fill().map((_, i) => ({
    month: i + 1,
    income: 0,
    expense: 0
  }));

  transactions.forEach(t => {
    const monthIndex = t._id.month - 1;
    if (t._id.type === 'income') {
      result[monthIndex].income = t.total;
    } else {
      result[monthIndex].expense = t.total;
    }
  });

  res.status(200).json({
    success: true,
    data: result
  });
});