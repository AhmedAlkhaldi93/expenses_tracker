import express from 'express';
import incomeControllers from '../controllers/incomeController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();
const {
  getAllIncome,
  getIncomeById,
  getUserIncome,
  getIncomeBySource,
  createIncome,
  updateIncome,
  deleteIncome
} = incomeControllers;

router.get('/income', verifyToken, getAllIncome);
router.get('/income/:id', verifyToken, getIncomeById);
router.get('/income/user/:id', verifyToken, getUserIncome);
router.get('/income/source/:source', verifyToken, getIncomeBySource);
router.post('/income', verifyToken, createIncome);
router.put('/income/:id', verifyToken, updateIncome);
router.delete('/income/:id', verifyToken, deleteIncome);

export default router;
