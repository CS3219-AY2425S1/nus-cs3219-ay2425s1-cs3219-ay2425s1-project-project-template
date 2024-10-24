import express, { json } from 'express';
import matchRoutes from './routes/matchRoutes.js';
import matchController from './controllers/matchController.js';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(json());
app.use('/matcher', matchRoutes);
app.use(cors());

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    matchController.initializeQueueProcessing();
});
