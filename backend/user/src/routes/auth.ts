import express from 'express';

import { login, logout } from '@/controllers/auth';
import { limiter } from '@/lib/ratelimit';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);

router.use(limiter);

export default router;
