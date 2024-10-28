const express = require('express');
const {
    viewHistory,
    saveCollaborationHistory,
    deleteAllCollaborationHistory,
} = require('../controller/historyController');
const {
    authMiddleware,
} = require('../middleware/authMiddleware');

const router = express.Router();

// Get all history by user ID
router.get('/:userId', viewHistory);

// Save a history
router.post('/', saveCollaborationHistory);

// Delete all history
router.delete('/', authMiddleware, deleteAllCollaborationHistory);

module.exports = router;
