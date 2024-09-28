require("dotenv").config();
const express = require("express");
const cors = require('cors');
// const userRouter = require('./userRoutes');
const questionRoutes = require('./questionRoutes');
const app = express();

// Use CORS to allow requests
app.use(cors());

app.use(express.json());
// app.use(userRouter);

const mongoose = require("mongoose");
const dbConnectionString = process.env.MONGODB_URI;

mongoose.connect(dbConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB database");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

app.use('/', questionRoutes);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
