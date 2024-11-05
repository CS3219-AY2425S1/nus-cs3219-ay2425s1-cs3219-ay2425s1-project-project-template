const cors = require("cors"); 
const express = require("express");
const bodyParser = require("body-parser");
const historyRoutes = require("./routes/historyRoutes");
const firebaseConfig = require("./config/firebaseConfig"); // Ensure Firebase is initialized
const authenticateToken = require("./middleware/authenticateToken");
const app = express();

// Allow requests from https://frontend-1079323726684.asia-southeast1.run.app (cloudrun production), http://localhost:3000 (docker compose frontend), and http://localhost:5173 (development frontend) with credentials
app.use(cors({
  origin: ['https://frontend-1079323726684.asia-southeast1.run.app', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Handle preflight requests for all routes
app.options('*', cors());

// Middleware
app.use(authenticateToken) // Verifies user authenticity, stops here if it fails to verify
app.use(bodyParser.json()); // Parse JSON request bodies

// Routes
app.use("/", historyRoutes);

module.exports = app;
