const express = require('express');
const { executeCode } = require('../controllers/codeController');

const router = express.Router();

// Health check
router.get('/', (req, res) => {
    return res.status(200).send('Hello world!');
});

// Route to execute code
router.post('/', executeCode);

module.exports = router;
