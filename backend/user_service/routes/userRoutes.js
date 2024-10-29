const { addToUserCollection, checkUsernameExists, checkAdminStatus, getUsernameByUid } = require('../controllers/userController');
const express = require('express');
const authenticateToken = require('../middleware/authenticateToken'); // Import the authentication middleware
const router = express.Router();

// Check Session Route (authentication required)
router.post('/verify-token', authenticateToken, (req, res) => {
  // Respond with user data if the session is valid
  res.status(200).json({ user: req.user });
});

// Route to create a new user
router.post('/user/addToUserCollection', addToUserCollection);

// Route for checking admin status
router.get('/admin/checkAdminStatus', checkAdminStatus); 

// Add the endpoint to check for username existence
router.get('/check-username', checkUsernameExists);

// Route to get username by uid
router.get('/user/username/:uid', getUsernameByUid);

module.exports = router;