import express, { Application } from 'express';
import dotenv from 'dotenv';
import questionRoutes from './routes/question-routes';
import { connectToDB } from './repo/question-repo';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB and start the server only if the connection is successful
async function startServer() {
    try {
        await connectToDB();
        console.log('Connected to MongoDB');

        // Use the question routes, and prefix all routes with /api
        app.use('/api', questionRoutes);

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);  // Exit the process if connection fails
    }
}

startServer();
