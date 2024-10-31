// routes/attempt-routes.ts

import express from 'express';
import {
  createAttemptController,
  getAttemptsByUserController,
  deleteLatestAttemptController,
  cleanupInvalidAttemptsForUserController,
} from "../controller/attempt-controller";
import { authenticateJWT, isAdmin } from "../middleware/auth-middleware";

const router = express.Router();

// POST /api/attempts
router.post('/attempts', authenticateJWT, (req, res, next) => {
  next();
}, createAttemptController);

// GET /api/attempts
router.get('/attempts', authenticateJWT, (req, res, next) => {
  next();
}, getAttemptsByUserController);


// DELETE /api/attempts
router.delete('/attempts', authenticateJWT, isAdmin, (req, res, next) => {
    next();
  }, deleteLatestAttemptController);
  


// DELETE /api/attempts/cleanup
router.delete('/attempts/cleanup', authenticateJWT, isAdmin, (req, res, next) => {
    next();
  }, cleanupInvalidAttemptsForUserController);

export default router;
