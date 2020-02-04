const express = require('express');
const router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const Expense = require('../models/Expense');

router.post('/', (req, res, next) => {
  const {
    description,
    value,
    split: { paidBy, dividedBy },
  } = req.body;

  try {
    const newExpense = new Expense({
      owner: req.groupId,
      description,
      value,
      split: {
        paidBy,
        dividedBy,
      },
    });
    newExpense.save();
    res.status(201).json({
      msg: `expense with value of ${newExpense.value} created sucessfully`,
      newExpense,
    });
  } catch (error) {
    next(error);
  }
});

router.param('expenseId', (req, res, next, expenseIdParam) => {
  if (!mongoose.Types.ObjectId.isValid(expenseIdParam)) {
    res.status(400).json({ msg: 'invalid expenseId!' });
    return;
  }
  req.expenseId = expenseIdParam;
  next();
});

router.use('/:expenseId', require('./oneExpense'));

module.exports = router;
