import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from '../config';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

const matchingServiceProxy = createProxyMiddleware({
  target: config.services.matching,
  changeOrigin: true,
  pathRewrite: {
    '^/api/matching': '',
  },
});

// router.use(authMiddleware as express.RequestHandler);
// router.use('/api/matching', matchingServiceProxy as express.RequestHandler);

export default router;
