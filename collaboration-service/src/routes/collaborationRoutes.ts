import express from 'express';
import { joinRoom, createRoom, getRoomData, setRoomInactive, getRoomId } from '../controllers/collaborationController';
import { verifyJWT } from '../middleware/jwt-authentication';
const router = express.Router();

router.post('/join', verifyJWT, joinRoom);
router.post('/createRoom', verifyJWT, createRoom);
router.get('/data', verifyJWT, getRoomData);
router.post('/setInactive', setRoomInactive);
router.get('/current', verifyJWT, getRoomId);

export default router;
