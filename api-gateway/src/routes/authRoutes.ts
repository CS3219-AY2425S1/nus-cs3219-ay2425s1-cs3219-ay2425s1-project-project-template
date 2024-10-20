import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from '../config';

const router = express.Router();

const authServiceProxy = createProxyMiddleware({
  target: config.services.auth,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '',
  },
});

router.use('/api/auth', authServiceProxy as express.RequestHandler);

export default router;
