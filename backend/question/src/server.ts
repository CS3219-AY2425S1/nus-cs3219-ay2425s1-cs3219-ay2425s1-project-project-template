import express from "express";
import questionRoutes from "./routes/questionRoutes";
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const uri = process.env.MONGODB_URI || "";

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', questionRoutes)

const PORT = process.env.PORT || "3003";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

connect();

app.listen(PORT, (err?: Error) => {
    if (err) {
      return console.error(err);
    }
    return console.log(`App is running on port ${PORT}`);
  });