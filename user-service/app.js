const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');  // Import the database connection
const userRoutes = require('./routes/userRoutes'); // Import routes
const authRoutes = require('./routes/authRoutes'); // Import routes

// Initialize Express app
const app = express();

// Load environment variables
require('dotenv').config();

// Connect to database
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Handle CORS
app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  // Browsers usually send this before PUT or POST Requests
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    return res.status(200).json({});
  }

  // Continue Route Processing
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes)

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Hello from user service.' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
