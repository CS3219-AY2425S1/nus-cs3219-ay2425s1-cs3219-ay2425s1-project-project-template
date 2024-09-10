import { Request, Response } from 'express';
import {
    addUserToSearchPool,
    getTimeSpentMatching,
    getCurrentMatchingUsersCount,
    removeUserFromSearchPool,
    matchUsers
} from '../model/matching-model';

export async function registerForMatching(req: Request, res: Response) {
    try {
        const { userId, criteria } = req.body;
        if (userId && criteria) {
            addUserToSearchPool(userId, criteria);
            return res.status(200).json({ message: 'User registered for matching successfully' });
        } else {
            return res.status(400).json({ message: 'User ID or criteria are missing' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Unknown error when registering user for matching' });
    }
}

export async function getMatchingTime(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing' });
        }

        const timeSpent = getTimeSpentMatching(userId);
        if (timeSpent !== null) {
            return res.status(200).json({ timeSpent });
        } else {
            return res.status(404).json({ message: `User ${userId} not found` });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Unknown error when retrieving matching time' });
    }
}

export async function getMatchingUsersCount(req: Request, res: Response) {
    try {
        const count = getCurrentMatchingUsersCount();
        return res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Unknown error when retrieving matching users count' });
    }
}

export async function cancelMatching(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing' });
        }

        const user = removeUserFromSearchPool(userId);
        if (user) {
            return res.status(200).json({ message: `Cancelled matching for user ${userId}` });
        } else {
            return res.status(404).json({ message: `User ${userId} not found` });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Unknown error when cancelling matching' });
    }
}

export async function findMatches(req: Request, res: Response) {
    try {
        const matches = matchUsers();
        if (matches) {
            return res.status(200).json({ matches });
        } else {
            return res.status(404).json({ message: 'No matches found' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Unknown error when finding matches' });
    }
}
