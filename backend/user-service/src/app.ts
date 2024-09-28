// src/app.ts
import express from 'express';
import authRoutes from './auth/routes/authRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();
app.use(express.json());

// Routes
app.use('/api/users', authRoutes);

// Middleware for handling errors
app.use(errorHandler);

export default app;
