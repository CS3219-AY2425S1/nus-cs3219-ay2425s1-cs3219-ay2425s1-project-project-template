import express from 'express';
import questionRoutes from './questionRoutes';
import authRoutes from './authRoutes';
import matchingRoutes from './matchingRoutes';

const router = express.Router();

router.use('/questions', questionRoutes);
router.use('/auth', authRoutes);
router.use('/matching', matchingRoutes);

export default router;
