const Expense = require('../models/Expense');

const addExpense = async ({ userId, price, description }) => {
  const expense = new Expense({
    userId,
    price:       Number(price),
    description: String(description).trim(),
  });

  await expense.save();

  return formatExpense(expense);
};

const updateExpense = async ({ expenseId, userId, price, description }) => {
  const expense = await Expense.findOne({ _id: expenseId, userId });
  if (!expense) {
    const err = new Error('Expense not found');
    err.statusCode = 404;
    throw err;
  }

  if (price !== undefined && price !== null)   expense.price       = Number(price);
  if (description !== undefined)               expense.description = String(description).trim();

  await expense.save();

  return formatExpense(expense);
};

const deleteExpense = async ({ expenseId, userId }) => {
  const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });
  if (!expense) {
    const err = new Error('Expense not found');
    err.statusCode = 404;
    throw err;
  }

  return { id: expense._id };
};

const formatExpense = (expense) => ({
  id:          expense._id,
  userId:      expense.userId,
  price:       expense.price,
  description: expense.description,
  createdAt:   expense.createdAt,
  updatedAt:   expense.updatedAt,
});

const getExpenses = async ({ userId, pageNumber, itemNumber }) => {
  const page  = Number(pageNumber);
  const limit = Number(itemNumber);
  const skip  = (page - 1) * limit;

  const [expenses, totalItems] = await Promise.all([
    Expense.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Expense.countDocuments({ userId }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    pagination: {
      totalItems,
      totalPages,
      currentPage:  page,
      itemsPerPage: limit,
      hasNextPage:  page < totalPages,
      hasPrevPage:  page > 1,
    },
    expenses: expenses.map((e) => ({
      id:          e._id,
      userId:      e.userId,
      price:       e.price,
      description: e.description,
      createdAt:   e.createdAt,
      updatedAt:   e.updatedAt,
    })),
  };
};

module.exports = { addExpense, updateExpense, deleteExpense, getExpenses };
