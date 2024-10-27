// routes/execute.js
const express = require('express');
const router = express.Router();
const { runCodeInDocker, runCodeInIsolatedVm } = require('../sandbox');

// health check
router.get('/', async (req, res) => {
  res.status(200).send('hello world');
})

router.post('/', async (req, res) => {
    const { code, language } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    let result;
    if (language === 'javascript') {
        result = runCodeInIsolatedVm(code);
    } else if (['python', 'nodejs'].includes(language)) {
        result = await runCodeInDocker(code, language);
    } else {
        return res.status(400).json({ error: 'Unsupported language' });
    }

    if (result.error) {
        res.status(500).json({ error: result.error });
    } else {
        res.status(200).json({ output: result.output });
    }
});

module.exports = router;
