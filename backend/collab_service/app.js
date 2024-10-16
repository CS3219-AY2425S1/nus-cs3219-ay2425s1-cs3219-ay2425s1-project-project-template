const cors = require("cors"); 
const express = require("express");
const bodyParser = require("body-parser");
const collabRoutes = require('./routes/collabRoutes');
const firebaseConfig = require("./config/firebaseConfig"); // Ensure Firebase is initialized
const app = express();

// Allow requests from http://localhost:3000 (production frontend) and http://localhost:5173 (development frontend) with credentials
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Handle URL-encoded data

// Routes
app.use('/', collabRoutes);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;