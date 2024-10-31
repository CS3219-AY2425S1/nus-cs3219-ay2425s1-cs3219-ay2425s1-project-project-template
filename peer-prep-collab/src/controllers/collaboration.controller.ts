import { Request, Response, RequestHandler } from 'express';
import { createCollaborationService, getSessionData } from '../services/collaboration.services';

// Controller to handle creation of new collaboration service
export const startCollaboration: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { difficulty, category, sessionId } = req.body;

    if (!difficulty || !category || !sessionId) {
        res.status(400).json('Missing required fields');
        return;
    }

    try {
        // call service to CREATE collaboration session
        const session = await createCollaborationService(difficulty, category, sessionId);
        if (!session) {
            res.status(404).json('No suitable question found for specified difficulty and category');
            return;
        }
        res.status(201).json(session);
        return;
    } catch (error) {
        console.error('Error starting collaboration', error);
        res.status(500).jsonp('Error starting collaboration');
        return;
    }
};

// Controller to handle fetching session data
export const getCollaborationSession: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params;
    
    if (!sessionId) {
        res.status(400).json({error: 'Session ID is required'});
        return;
    }
    
    try {
        // Call service to retrieve session data
        const session = await getSessionData(sessionId);

        if (!session) {
            res.status(404).json({error: 'Session not found'});
            return;
        }

        res.status(200).json(session);
        return;
    } catch (error) {
        console.error('Error fetching collaboration session', error);
        res.status(500).jsonp('Error fetching collaboration');
        return;
    }
};
