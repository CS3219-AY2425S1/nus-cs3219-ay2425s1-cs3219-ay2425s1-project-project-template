import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 8001,
  corsOptions: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  services: {
    question: process.env.QUESTION_SERVICE_URL || 'http://localhost:4001',
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    matching: process.env.MATCHING_SERVICE_URL || 'http://localhost:5001',
  },
  jwtSecret: process.env.JWT_SECRET || '',
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
    user: process.env.RABBITMQ_USER || 'guest',
    password: process.env.RABBITMQ_PASSWORD || 'guest',
  },
};
