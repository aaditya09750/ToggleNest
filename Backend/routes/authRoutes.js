const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  updateProfile,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  registerValidators,
  loginValidators,
  passwordChangeValidators,
} = require('../middleware/validators');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later.' },
});

router.post('/register', authLimiter, registerValidators, registerUser);
router.post('/login', authLimiter, loginValidators, loginUser);

router.get('/me', protect, getMe);
router.get('/users', protect, getAllUsers);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, passwordChangeValidators, updatePassword);

module.exports = router;
