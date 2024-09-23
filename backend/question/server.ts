require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
import questionRoutes from "./routes/questionRoutes.ts";
const cors = require("cors");

const uri = process.env.MONGO_URL || "";

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
