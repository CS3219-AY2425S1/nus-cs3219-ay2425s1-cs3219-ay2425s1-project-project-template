import { Router } from 'express';
import { deleteRoom } from './deleteRoomController';

const router = Router();

router.post('/delete-room', deleteRoom);

export default router;
