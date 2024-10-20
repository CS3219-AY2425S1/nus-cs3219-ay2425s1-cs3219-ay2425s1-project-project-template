import express from 'express';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import config from '../config';
import { authMiddleware } from '../middleware/authMiddleware';
import logger from '../utils/logger';

const router = express.Router();

const questionServiceProxy = createProxyMiddleware({
  target: config.services.question,
  changeOrigin: true,
  pathRewrite: {
    '^/api/questions': '/api/v1/questions', // Rewrite the path
  },
});

router.use((req, res, next) => {
  logger.info(`Question route accessed: ${req.method} ${req.originalUrl}`);
  next();
});

// Log the proxied request path
router.use((req, res, next) => {
  logger.info(`Proxying request to: ${req.url}`);
  next();
});

// router.use(authMiddleware as express.RequestHandler);

// Apply the proxy middleware only to routes starting with /api/questions
router.use('/api/questions', questionServiceProxy as RequestHandler);

export default router;
