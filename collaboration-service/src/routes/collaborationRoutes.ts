import express from 'express';
import { joinRoom, createRoom, getRoomData, setRoomInactive } from '../controllers/collaborationController';

const router = express.Router();

router.post('/join', joinRoom);
router.post('/createRoom', createRoom);
router.get('/:id', getRoomData);
router.post('/setInactive', setRoomInactive)

export default router;
