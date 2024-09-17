import express, { Request, Response } from 'express';
import morgan from 'morgan';

const app = express();
const port = 3000;

// Middleware for parsing JSON
app.use(express.json());
app.use(morgan('dev'));

// Simple GET route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
