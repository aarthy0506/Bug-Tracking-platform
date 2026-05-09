const express = require('express');
const router  = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.post('/register',        register);
router.post('/login',           login);
router.post('/forgot-password', forgotPassword);

// Private
router.get('/me',         protect, getMe);
router.put('/password',   protect, updatePassword);

module.exports = router;
