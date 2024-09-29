require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { databaseConn } = require("./config/db");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 8081;

// iddleware
app.use(cors());
app.use(express.json());

// database connection -- 
databaseConn();

// routes
app.use("/users", userRoutes);

// start the server
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
