require("dotenv").config();

const express = require("express");
const matchingRoutes = require("./routes/matchingRoutes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', matchingRoutes)

const PORT = process.env.PORT || 3002;

app.listen(PORT, (err) => {
    if (err) {
      return console.error(err);
    }
    return console.log(`App is running on port ${PORT}`);
  });