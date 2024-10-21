import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from '../config';
import logger from '../utils/logger';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

const authServiceProxy = createProxyMiddleware({
  target: config.services.auth,
  changeOrigin: true,
  pathRewrite: {
    '^/(.*)': '/api/v1/auth/$1', // /auth -> /api/v1/auth
  },
});

router.use((req, res, next) => {
  logger.info(`Auth route accessed with remaining path: ${req.url}`);
  next();
});

// router.use(authMiddleware);
router.use('/api/auth', authServiceProxy as express.RequestHandler);

export default router;
