import express from "express";
import dotenv from "dotenv";
import userRoutes from "./api/routes/userRoutes";
import questionRoutes from "./api/routes/questionRoutes";
import { authenticateToken } from "./utility/jwtHelper";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.API_GATEWAY_PORT;

app.use(express.json());

// Routes
app.use("/auth", userRoutes);
app.use(authenticateToken);
app.use("/api/questions", questionRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("LeetCode API Gateway is running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
