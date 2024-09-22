import express from 'express';
import { register } from '@/controllers/registration/registerController';

const router = express.Router();
// Route to handle user registration
router.post('/', register);

export default router;
