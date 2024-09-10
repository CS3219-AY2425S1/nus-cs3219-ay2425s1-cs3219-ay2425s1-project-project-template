import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const secretKey = 'your_secret_key'; // Use an environment variable for this in production

// Function to validate JWT in HTTP requests
export function validateJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        req.body.userId = decoded.id; // Attach userId to request
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
}

// Function to validate JWT for socket connections
export function validateSocketJWT(token: string): JwtPayload {
    try {
        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        return decoded; // Return the decoded payload (userId, etc.)
    } catch (err) {
        throw new Error('Invalid token');
    }
}
