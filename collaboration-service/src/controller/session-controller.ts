import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Session from '../model/session-model';

export const sessionController = {
    createSession: async (req: Request, res: Response) => {
        const {
            participants, // pair of strings
            question,
            code, // retrieval of code from question #TODO change this out
        } = req.body;

        const sessionId = uuidv4(); // Use UUID for unique session ID
        const session = new Session({
            session_id: sessionId, // session_id, 
            date_created: new Date(),
            participants,
            question,
            code,
        });

        try {
            const data = await session.save();
            res.status(201).json(data);
        } catch (err) {
            console.error('Error creating session:', err); // Log the error
            res.status(500).json({ message: (err as Error).message });
        }
    },
    joinSession: async (req: Request, res: Response) => {
        const { sessionId, userId } = req.body

        try {
            // Find a session that the user is a participant of
            const session = await Session.findOne({ participants: userId });

            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }

            res.status(200).json(session);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    },
    terminateSession: async (req: Request, res: Response) => {
        const { sessionId } = req.body;

        try {
            const session = await Session.findOne({ session_id: sessionId });

            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }

            await Session.deleteOne({ session_id: sessionId });

            res.status(200).json({ message: 'Session terminated successfully' });
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }
};