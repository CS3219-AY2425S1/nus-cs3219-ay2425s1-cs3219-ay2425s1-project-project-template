import express from 'express';

import { login, logout } from '@/controllers/auth';
import { limiter } from '@/lib/ratelimit';
import { register } from '@/controllers/auth';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);
router.use(limiter);

export default router;
