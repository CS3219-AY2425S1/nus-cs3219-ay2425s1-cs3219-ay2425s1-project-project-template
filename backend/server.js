const express = require('express');
const apiRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// API routes
app.use('/', apiRouter);

// 404 handler for unmatched routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
