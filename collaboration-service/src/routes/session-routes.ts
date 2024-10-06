import { Request, Response, Router } from "express";
import { validateApiJWT } from '../middleware/jwt-validation';
import { sessionController } from "../controller/session-controller";

const router = Router();

// Test route
router.get('/', (req, res) => {res.send('Hello from session service!')}); 

// Create a new session
router.post("/session/create", sessionController.createSession);

// Join a session
router.post("/session/join", validateApiJWT, sessionController.joinSession);

// Terminate a session
router.delete("/session/terminate", validateApiJWT, sessionController.terminateSession);


export default router;