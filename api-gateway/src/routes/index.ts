import express from 'express';
import questionRoutes from './questionRoutes';
import authRoutes from './authRoutes';
import usersRoutes from './usersRoute';

const router = express.Router();

router.use('/questions', questionRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

export default router;
