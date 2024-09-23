import express from 'express';

import { login, logout } from '@/controllers/auth/auth-controller';
import { limiter } from '@/lib/ratelimit';
import { register } from '@/controllers/auth/auth-controller';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);
router.use(limiter);

export default router;
