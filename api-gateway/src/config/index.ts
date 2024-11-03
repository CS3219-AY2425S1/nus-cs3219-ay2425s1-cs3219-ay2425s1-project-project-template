import dotenv from 'dotenv';
import path from 'path';
import logger from '../utils/logger';

// Load different env files based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      logger.warn('FRONTEND_URL environment variable not set in production');
      return ['http://localhost:3000'];
    }
    // If frontendUrl already includes protocol, use it as is
    if (
      frontendUrl.startsWith('http://') ||
      frontendUrl.startsWith('https://')
    ) {
      const httpVersion = frontendUrl;
      const httpsVersion = frontendUrl.replace('http://', 'https://');
      return [httpVersion, httpsVersion];
    }
    // Otherwise, add protocols (backward compatibility)
    return [`http://${frontendUrl}`, `https://${frontendUrl}`];
  }
  return ['http://localhost:3000'];
};

export default {
  port: process.env.PORT || 8001,
  corsOptions: {
    origin: getAllowedOrigins(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
