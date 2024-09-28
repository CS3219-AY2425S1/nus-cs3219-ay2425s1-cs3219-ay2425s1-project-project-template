import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/envConfig';
import logger from '../../utils/logger';

const authStatusController = (req: Request, res: Response) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(200).json({ isAuthenticated: false });
    }

    try {
        jwt.verify(token, config.jwtSecret);
        logger.info('Token verified successfully!')
        return res.status(200).json({ isAuthenticated: true });
    } catch (error) {
        logger.warn('Token verification failed.')
        console.error('JWT verification failed:', error);
        return res.status(200).json({ isAuthenticated: false });
    }
};

export { authStatusController };
