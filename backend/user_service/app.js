const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const firebaseConfig = require("./config/firebaseConfig"); // Ensure Firebase is initialized
const app = express();

// Handle preflight requests for all routes
app.options("*", cors());

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies

// Routes
app.use("/", userRoutes);

module.exports = app;
