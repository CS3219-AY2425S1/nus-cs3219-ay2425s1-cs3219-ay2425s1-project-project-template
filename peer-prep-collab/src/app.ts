import express from 'express';
import dotenv from 'dotenv';
import collabRoutes from './routes/collaboration.routes';

dotenv.config();

const cors = require('cors');
const app = express();

// any origin
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type, Authorization']
}));

app.use(express.json());

// tells the server to use collabRoutes for any requests starting with '/collab'
app.use('/collab', collabRoutes);

// process.env = built-in object in Node.js that contains all the environment variables 
// process.env.PORT allows us to change the port the server runs on without modifying code (for diff environments)
const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
    console.log(`Collaboration service is running on port ${PORT}`);
})