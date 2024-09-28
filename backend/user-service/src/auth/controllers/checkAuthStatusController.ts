import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/envConfig';

const authStatusController = (req: Request, res: Response) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(200).json({ isAuthenticated: false });
    }

    try {
        jwt.verify(token, config.jwtSecret);
        return res.status(200).json({ isAuthenticated: true });
    } catch (error) {
        console.error('JWT verification failed:', error);
        return res.status(200).json({ isAuthenticated: false });
    }
};

export { authStatusController };
