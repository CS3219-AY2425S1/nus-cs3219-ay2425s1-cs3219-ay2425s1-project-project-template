import express from 'express';
import { joinRoom, createRoom, getRoomData, setRoomInactive, getRoomId } from '../controllers/collaborationController';

const router = express.Router();

router.post('/join', joinRoom);
router.post('/createRoom', createRoom);
router.get('/data', getRoomData);
router.post('/setInactive', setRoomInactive);
router.get('/current', getRoomId);

export default router;
