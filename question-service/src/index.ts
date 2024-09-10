import express, { Application } from "express";
import mongoose from "mongoose";
import router from "./routes/question-routes";
import authMiddleware from "./middleware/question-middleware";

const app: Application = express();
const MONGODB_URI = "mongodb+srv://user:pw@cluster0.g5j0k.mongodb.net/peerprep";

// Middleware
app.use(express.json());
app.use(authMiddleware);

// MongoDB connection
mongoose
  .connect(MONGODB_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

// Routes
app.use("/api/questions", router);

export default app;
