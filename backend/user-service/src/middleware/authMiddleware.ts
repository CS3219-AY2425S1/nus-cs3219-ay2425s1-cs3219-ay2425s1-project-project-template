// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger'; // Ensure you have a logger middleware set up
import { config } from '../config/envConfig';
import { verifyToken } from '../auth/auth_utils/jwtUtils';

interface AuthenticatedUser {
    userId: string;
    email: string;
}

interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}

const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    logger.info(`Authentication attempt. Token present: ${!!token}`);

    if (!token) {
        logger.warn('Unauthorized access attempt: No token provided.');
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }
    
    try {
        const decoded = verifyToken(token) as AuthenticatedUser;
        req.user = decoded;
        logger.info(`Authenticated user: ${decoded.email}`);
        next();
    } catch (error) {
        logger.warn('Unauthorized access attempt: Invalid token.');
        return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
};

export { authenticate, AuthenticatedRequest };
