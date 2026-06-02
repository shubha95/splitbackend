const { validateAddExpense, validateUpdateExpense, validateGetExpenses } = require('../validations/expenseValidation');
const { addExpense, updateExpense, deleteExpense, getExpenses }          = require('../services/expenseService');
const { sendSuccess, sendError }                    = require('../utils/responseHelper');

exports.addExpense = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { price, description } = req.body;

    const errors = validateAddExpense({ price, description });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    const result = await addExpense({ userId: req.user.id, price, description });
    return sendSuccess(res, 201, 'Expense added successfully', result);
  } catch (err) {
    return sendError(res, 500, 'Internal server error');
  }
};

exports.updateExpense = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { productID, price, description } = req.body;

    if (!productID) {
      return sendError(res, 400, 'productID is required in request body', [{ field: 'productID', message: 'productID is required' }]);
    }

    if (price === undefined && description === undefined) {
      return sendError(res, 400, 'Provide at least one field to update: price or description', []);
    }

    const errors = validateUpdateExpense({ price, description });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    const result = await updateExpense({ expenseId: productID, userId: req.user.id, price, description });
    return sendSuccess(res, 200, 'Expense updated successfully', result);
  } catch (err) {
    if (err.statusCode === 404) {
      return sendError(res, 404, err.message);
    }
    return sendError(res, 500, 'Internal server error');
  }
};

exports.getExpenses = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { pageNumber, itemNumber } = req.body;

    const errors = validateGetExpenses({ pageNumber, itemNumber });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    const result = await getExpenses({ userId: req.user.id, pageNumber, itemNumber });
    return sendSuccess(res, 200, 'Expenses fetched successfully', result);
  } catch (err) {
    return sendError(res, 500, 'Internal server error');
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { productID } = req.body;

    if (!productID) {
      return sendError(res, 400, 'productID is required in request body', [{ field: 'productID', message: 'productID is required' }]);
    }

    const result = await deleteExpense({ expenseId: productID, userId: req.user.id });
    return sendSuccess(res, 200, 'Expense deleted successfully', result);
  } catch (err) {
    if (err.statusCode === 404) {
      return sendError(res, 404, err.message);
    }
    return sendError(res, 500, 'Internal server error');
  }
};
