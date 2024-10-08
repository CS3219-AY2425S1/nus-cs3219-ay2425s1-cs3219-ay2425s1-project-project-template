import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.MATCHING_SERVICE_PORT;

app.use(express.json());

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Matching Service is running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
