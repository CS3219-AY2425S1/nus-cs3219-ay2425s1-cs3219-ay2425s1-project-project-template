import express from 'express';
import { registerUser } from '../controllers/userSignUpController';
import { userLoginController } from '../controllers/logInController';
import { authenticate, AuthenticatedRequest } from '../../middleware/authMiddleware';
import { authStatusController } from '../controllers/checkAuthStatusController';
const router = express.Router();

// POST /api/users/register
router.post('/register', registerUser);
// POST /api/users/login
router.post('/login', userLoginController);
// POST /api/users/logout
router.post('/logout', authenticate, (req: AuthenticatedRequest, res: express.Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict' as 'strict' | 'lax' | 'none',
    });
    res.status(200).json({ message: 'Logged out successfully.' });
});
// GET /api/users/status
router.get('/status', authStatusController);
// Example Protected Route
router.get('/protected', authenticate, (req: AuthenticatedRequest, res: express.Response) => {
    res.status(200).json({ message: 'This is a protected route.', user: req.user });
});

export default router;
