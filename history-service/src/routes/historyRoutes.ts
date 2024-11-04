import express from 'express';
import { getUserHistory} from '../controllers/historyController';
import { verifyJWT } from '../middleware/jwt-authentication';
const router = express.Router();

router.post('/data', verifyJWT, getUserHistory);

export default router;
