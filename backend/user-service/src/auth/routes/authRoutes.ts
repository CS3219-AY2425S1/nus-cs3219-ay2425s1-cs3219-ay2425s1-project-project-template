import express from 'express';
import { registerUser } from '../controllers/userSignUpController';

const router = express.Router();

// For registration
router.post('/register', registerUser);

export default router;
