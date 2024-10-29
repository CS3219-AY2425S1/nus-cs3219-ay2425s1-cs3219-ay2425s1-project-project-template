const express = require('express');
const { executeCode } = require('../controllers/codeController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Health check
router.get('/', (req, res) => {
    return res.status(200).send('Hello world!');
});

router.get('/languages', (req, res) => {
    return res.status(200).json(['python', 'javascript', 'cpp']);
});

// Route to execute code
router.post('/', authMiddleware, executeCode);

module.exports = router;
