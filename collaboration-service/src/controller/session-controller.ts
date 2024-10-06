import { Request, Response } from 'express';
import Session from '../model/session-model';

export const sessionController = {
    createSession: async (req: Request, res: Response) => {
        const {
            session_id, // assuming session id is passed in the request body
            participants,
            question,
            code,
        } = req.body;

        // const sessionId = Math.random().toString(36).substring(2, 8);
        const session = new Session({
            session_id: session_id, //sessionId,
            date_created: new Date(),
            participants,
            question,
            code,
        });

        await session.save()
            .then((data) => {
                res.status(201).json(data);
            })
            .catch((err) => {
                res.status(500).json({ message: (err as Error).message });
            });
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