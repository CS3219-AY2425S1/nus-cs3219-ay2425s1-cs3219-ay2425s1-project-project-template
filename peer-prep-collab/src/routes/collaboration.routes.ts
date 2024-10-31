import {Router} from 'express';
import { startCollaboration, getCollaborationSession } from '../controllers/collaboration.controller';

const router = Router();

// Route to start a new collaboration session
router.post('/start', startCollaboration);

// Route to get an existing collaboration session by sessionId
router.get('/:sessionId', getCollaborationSession);

export default router;