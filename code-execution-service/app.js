const express = require('express');
const codeRoutes = require('./routes/codeRoutes');

const app = express();
const PORT = 8000;

app.use(express.json());

// Use the routes
app.use('/api/codex', codeRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Code execution service running on port ${PORT}`);
});
