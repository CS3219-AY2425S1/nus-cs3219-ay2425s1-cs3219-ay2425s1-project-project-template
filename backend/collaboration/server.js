require("dotenv").config();

const express = require("express");
const collaborationRoutes = require("./routes/collaborationRoutes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', collaborationRoutes)

const PORT = process.env.PORT || 3001;

app.listen(PORT, (err) => {
    if (err) {
      return console.error(err);
    }
    return console.log(`App is running on port ${PORT}`);
  });