require("dotenv").config();

const express = require("express");
const questionRoutes = require("./routes/questionRoutes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', questionRoutes)

const PORT = process.env.PORT || 3003;

app.listen(PORT, (err) => {
    if (err) {
      return console.error(err);
    }
    return console.log(`App is running on port ${PORT}`);
  });