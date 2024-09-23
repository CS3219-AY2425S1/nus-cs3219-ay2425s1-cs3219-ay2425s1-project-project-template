require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const questionRoutes = require("./routes/questionRoutes");
const cors = require("cors");

const uri =
  "mongodb+srv://jehousoh:cs3219@questionbank.4xtdt.mongodb.net/?retryWrites=true&w=majority&appName=QuestionBank";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", questionRoutes);

const PORT = process.env.PORT || 3003;

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

connect();

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`App is running on port ${PORT}`);
});
