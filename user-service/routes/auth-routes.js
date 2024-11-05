import express from 'express';
import {
  handleLogin,
  handleVerifyToken,
  verifyPassword,
} from '../controller/auth-controller.js';
import { handleGithubCallback } from '../controller/oauth-controller.js';
import { verifyAccessToken } from '../middleware/basic-access-control.js';

const router = express.Router();

router.post('/login', handleLogin);

router.get('/verify-token', verifyAccessToken, handleVerifyToken);

router.get('/github/callback', handleGithubCallback);

router.post('/verify-password/:id', verifyAccessToken, verifyPassword);

export default router;
