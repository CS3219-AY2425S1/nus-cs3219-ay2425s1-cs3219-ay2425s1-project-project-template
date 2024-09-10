const express = require('express');
const router = express.Router();

// Sample hAPI route
router.get('/hello', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

// Post example
router.post('/data', (req, res) => {
    const { data } = req.body;
    res.json({ receivedData: data });
});

module.exports = router;