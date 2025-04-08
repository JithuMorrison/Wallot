const Transaction = require('../models/Transaction');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = asyncHandler(async (req, res, next) => {
  const transactions = await Transaction.find({ user: req.user.id }).sort('-date');
  
  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions
  });
});

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Private
exports.addTransaction = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  
  const transaction = await Transaction.create(req.body);
  
  res.status(201).json({
    success: true,
    data: transaction
  });
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = asyncHandler(async (req, res, next) => {
  let transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return next(
      new ErrorResponse(`Transaction not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns the transaction
  if (transaction.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User not authorized to update this transaction`, 401)
    );
  }

  transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: transaction
  });
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return next(
      new ErrorResponse(`Transaction not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns the transaction
  if (transaction.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User not authorized to delete this transaction`, 401)
    );
  }

  await transaction.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});