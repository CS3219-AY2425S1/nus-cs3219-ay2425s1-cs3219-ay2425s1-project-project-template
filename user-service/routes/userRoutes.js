const express = require('express');
const {
  updateProfile,
  viewProfile,
} = require('../controller/userController');

const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Change username and password route
router.put('/profile', authMiddleware, updateProfile);

// View profile route
router.get('/profile', authMiddleware, viewProfile);

module.exports = router;
