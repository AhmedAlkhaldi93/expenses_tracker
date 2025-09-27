import express from 'express';
import expenseControllers from '../controllers/expenseController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();
const {
  getAllExpenses,
  getExpenseById,
  getUserExpenses,
  getExpensesByCategory,
  createExpense,
  updateExpense,
  deleteExpense
} = expenseControllers;

router.get('/expenses', verifyToken, getAllExpenses);
router.get('/expenses/:id', verifyToken, getExpenseById);
router.get('/expenses/user/:id', verifyToken, getUserExpenses);
router.get('/expenses/category/:category', verifyToken, getExpensesByCategory);
router.post('/expenses', verifyToken, createExpense);
router.put('/expenses/:id', verifyToken, updateExpense);
router.delete('/expenses/:id', verifyToken, deleteExpense);

export default router;
