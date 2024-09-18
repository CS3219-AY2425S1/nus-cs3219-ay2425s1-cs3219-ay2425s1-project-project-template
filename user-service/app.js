const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');  // Import the database connection
const userRoutes = require('./routes/userRoutes'); // Import routes

// Initialize Express app
const app = express();

// Load environment variables
require('dotenv').config();

// Middleware
app.use(bodyParser.json());

// Connect to database
connectDB();

// Routes
app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
