import { validateJWT } from '../src/middleware/jwt-validation';
import jwt from 'jsonwebtoken';

describe('Socket Middleware', () => {
    it('should validate token and extract userId', () => {
        const secretKey = 'your_secret_key';
        const userId = 'testUser';
        const token = jwt.sign({ id: userId }, secretKey);

        const decoded = validateJWT(token);
        expect(decoded.id).toBe(userId);
    });

    it('should throw an error for invalid token', () => {
        expect(() => validateJWT('invalid_token')).toThrow();
    });
});
