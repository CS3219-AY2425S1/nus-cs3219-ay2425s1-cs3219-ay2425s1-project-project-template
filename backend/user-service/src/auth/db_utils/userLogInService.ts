// src/auth/services/userLogInService.ts
import { config } from '../../config/envConfig'; // Import centralized config

import User from '../../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../../utils/logger';
import { generateToken } from '../auth_utils/jwtUtils';

interface LoginInput {
    email: string;
    password: string;
}

export const loginUser = async ({ email, password }: LoginInput): Promise<string> => {
    const user = await User.findOne({ email });
    if (!user) {
        logger.warn('User not found.');
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        logger.warn('Wrong password.');
        throw new Error('Invalid email or password');
    }

    const token = generateToken(user)

    return token;
};
