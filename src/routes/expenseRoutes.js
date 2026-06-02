const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/authMiddleware');
const expense    = require('../controllers/expenseController');

router.post('/',    auth, expense.addExpense);
router.post('/list', auth, expense.getExpenses);
router.put('/',     auth, expense.updateExpense);
router.delete('/',  auth, expense.deleteExpense);

module.exports = router;
