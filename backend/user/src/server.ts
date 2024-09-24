import express from "express";
import userRoutes from "./routes/userRoutes";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', userRoutes)

const PORT = process.env.PORT || "3004";

app.listen(PORT, (err?: Error) => {
    if (err) {
      return console.error(err);
    }
    return console.log(`App is running on port ${PORT}`);
  });