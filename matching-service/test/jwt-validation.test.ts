import { validateSocketJWT } from '../src/middleware/jwt-validation';
import jwt from 'jsonwebtoken';

describe('Socket Middleware', () => {
    it('should validate token and extract userId', () => {
        const secretKey = 'your_secret_key';
        const userId = 'testUser';
        const token = jwt.sign({ userId }, secretKey);

        const decoded = validateSocketJWT(token);
        expect(decoded.userId).toBe(userId);
    });

    it('should throw an error for invalid token', () => {
        expect(() => validateSocketJWT('invalid_token')).toThrow();
    });
});
