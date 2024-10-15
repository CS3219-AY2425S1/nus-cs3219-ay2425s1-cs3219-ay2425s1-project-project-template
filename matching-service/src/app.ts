import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.dev" });

const app = express();
const PORT = process.env.PORT || 5001; // 5001 to prevent conflicts

app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

const apiVersion = "/api/v1";

// Middleware to handle CORS and preflight requests
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*'); // Allow all origins

//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization',
//   );

//   // Handle preflight (OPTIONS) request before PUT or POST
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH');
//     return res.status(200).json({});
//   }

//   // Continue to next middleware
//   next();
// });

// ping server
app.get(`${apiVersion}/ping`, (req, res) => {
  res.status(200).json({ data: "pong" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
