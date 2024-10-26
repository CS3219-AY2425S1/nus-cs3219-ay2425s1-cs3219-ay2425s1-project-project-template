import { Request, Response, Router } from "express";
import { validateApiJWT } from '../middleware/jwt-validation';
import { sessionController } from "../controller/session-controller";

const router = Router();

// Test route
router.get('/', (req, res) => {res.send('Hello from session service!')});

// Create a new session
router.post("/create", sessionController.createSession);

// Check if user is in a session
router.post("/check", validateApiJWT, sessionController.checkSessionStatus);

// Remove user from session
router.post("/leave", validateApiJWT, sessionController.leaveSession);

export default router;
