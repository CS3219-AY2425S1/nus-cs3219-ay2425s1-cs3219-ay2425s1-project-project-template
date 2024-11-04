import { Request, Response, RequestHandler } from 'express';
import { createCollaborationService, getSessionData } from '../services/collaboration.services';
import { updateUserService } from '..';

export const initiateCollaboration = async (sessionId: string, difficulty: string, category: string, username1: string, username2: string) => {
    try {
        // call service to CREATE collaboration session
        const session = await createCollaborationService(sessionId, difficulty, category, username1, username2);
    
        if (!session) {
            console.log('No suitable question found for specified difficulty and category');
            return null;
        }
        updateUserService(session);
        return session;
    } catch (error) {
        console.error('Error starting collaboration', error);
        return null;
    }
}

// Controller to handle creation of new collaboration service - kept for testing
export const startCollaboration: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { sessionId, difficulty, category, username1, username2 } = req.body;
    try {
        // Call service to create collaboration service
        const session = await initiateCollaboration(sessionId, difficulty, category, username1, username2);
        res.status(200).json(session);
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
