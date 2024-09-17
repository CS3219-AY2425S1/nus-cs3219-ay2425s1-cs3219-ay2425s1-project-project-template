import express, { Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from '../routes/userRoutes';
import connectDB from './config/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());
app.use(morgan('combined'));
app.use(router);

connectDB();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
