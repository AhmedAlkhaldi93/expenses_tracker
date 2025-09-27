import express from 'express';

import userControllers from '../controllers/user.js';
import verifyToken from '../middleware/verifyToken.js';

const { register, login, logout } = userControllers;

const router = express.Router();

// routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/verify', verifyToken, (req, res) => {
  res.status(200).json({ message: "Authorized" });
});


router.get('/dashboard', verifyToken, (req, res) => {
  res.status(200).json({ 
      message: 'Welcome to your dashboard',
      user: req.user 
  });
});



export default router;
 