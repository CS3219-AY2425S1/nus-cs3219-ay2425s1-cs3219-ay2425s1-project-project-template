import express from 'express';
import questionRoutes from './questionRoutes';
import authRoutes from './authRoutes';
import usersRoutes from './usersRoute';
import matchingRoutes from './matchingRoutes';

const router = express.Router();

router.use('/questions', questionRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/matching', matchingRoutes);

export default router;
