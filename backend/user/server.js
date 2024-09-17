require("dotenv").config();

const express = require("express");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', userRoutes)

const PORT = process.env.PORT || 3004;

app.listen(PORT, (err) => {
    if (err) {
      return console.error(err);
    }
    return console.log(`App is running on port ${PORT}`);
  });