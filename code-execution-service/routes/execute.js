// routes/execute.js
const express = require('express');
const router = express.Router();
const { runCodeInDocker } = require('../sandbox');

// Supported languages
const SUPPORTED_LANGUAGES = ['python', 'javascript', 'nodejs'];

// Health check
router.get('/', (req, res) => {
    res.status(200).send('hello world');
});

// Execute code endpoint
router.post('/', async (req, res) => {
    const { code, language } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    // Check if language is supported
    if (!SUPPORTED_LANGUAGES.includes(language)) {
        return res.status(400).json({ error: 'Unsupported language' });
    }

    // Run the code in Docker and handle the result
    const result = await runCodeInDocker(code, language);

    // Send the response
    if (result.error) {
        res.status(500).json({ error: result.error });
    } else {
        res.status(200).json({ output: result.output });
    }
});

module.exports = router;
