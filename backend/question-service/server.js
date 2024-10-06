require("dotenv").config();
const express = require("express");
const app = express();

const cors = require('cors');
app.use(cors());

const questionRoutes = require('./questionRoutes');

app.use(express.json());
app.use(questionRoutes);

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

console.log(__dirname);
//app.use(express.static("/".join(__dirname, 'public')));

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
