const express = require('express');
const authenticateToken = require('../middleware/authenticateToken'); // Import the authentication middleware
const router = express.Router();

// Check Session Route (authentication required)
router.post('/verify-token', authenticateToken, (req, res) => {
  // Respond with user data if the session is valid
  res.status(200).json({ user: req.user });
});

module.exports = router;
