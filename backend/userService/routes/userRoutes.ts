import express from 'express';
import { getAllUsers, createUser } from '../controllers/userController';

const router = express.Router();

// Define routes and associate them with controller functions
router.get('/', getAllUsers);
router.post('/', createUser);

export default router;