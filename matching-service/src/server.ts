import express from 'express';
import matchRoutes from './routes/match-routes';
import { consumeMatchRequests } from './service/match-service';
import { connectRabbitMQ } from './queue/rabbitmq';
import cors from "cors";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

// To handle CORS Errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // "*" -> Allow all links to access

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  // Browsers usually send this before PUT or POST Requests
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    return res.status(200).json({});
  }

  // Continue Route Processing
  next();
});

app.use('/api', matchRoutes);

app.listen(PORT, async () => {
  try {
    await connectRabbitMQ();
    consumeMatchRequests();
    console.log(`Matching service is running on port ${PORT}`);
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    process.exit(1);
  }
});
