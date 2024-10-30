import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

dotenv.config();
const USER_SERVICE_URI = process.env.USER_SERVICE_URI || 'http://localhost:3001';

export async function verifyJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.status(401).json({ 
            message: "Authentication failed" 
        });
        return;
    }

    // request auth header: `Authorization: Bearer + <access_token>`
    const token = authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ 
            message:"Authentication failed. Missing token." 
        });
    }

    try {
        // Using user service to verify
        console.log('Verifying JWT through User Service');
        const res = await axios.get(`${USER_SERVICE_URI}/auth/verify-token`, 
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        req.body.userId = res.data.data.id;
        next();

    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                res.status(401).json({ 
                    message: "Authentication failed. Invalid token." 
                });
            }
            res.status(500).json({ 
                message: "Authentication failed. User Service error." 
            });
        } 

        console.error('Unexpected error:', err);
        res.status(500).json({ 
            message: "Failed to authenticate." 
        });
        
    }
}
