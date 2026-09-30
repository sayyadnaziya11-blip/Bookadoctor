const express = require('express');
const {
  registerController,
  loginController,
  getUserInfoController,
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/getUserData', authMiddleware, getUserInfoController);

module.exports = router;
