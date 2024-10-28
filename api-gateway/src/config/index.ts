import dotenv from 'dotenv';
import path from 'path';

// Load different env files based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

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
    url: process.env.RABBITMQ_URL || 'ws://localhost:15674/ws',
    username: process.env.RABBITMQ_USERNAME || 'guest',
    password: process.env.RABBITMQ_PASSWORD || 'guest',
    queue: process.env.RABBITMQ_QUEUE || 'matching-service-local',
  },
};
