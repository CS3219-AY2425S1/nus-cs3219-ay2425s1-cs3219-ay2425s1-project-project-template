import {Router} from 'express';
import { startCollaboration, getCollaborationSession, getDocument } from '../controllers/collaboration.controller';

const router = Router();

// Route to start a new collaboration session - for testing. Collaboration is triggered by RabbitMQ.
router.post('/start', startCollaboration);

// Route to get an existing collaboration session by sessionId
router.get('/:sessionId', getCollaborationSession);

router.get('/code/:documentId', getDocument)

export default router;