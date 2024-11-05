import express from "express";

import { handleLogin, handleVerifyToken, handleVerifyEmailToken, handleResendVerification, handleForgetPassword, handleVerifyOtp, handleResendOtp } from "../controller/auth-controller.js";
import { verifyAccessToken } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/login", handleLogin);

router.get("/verify-token", verifyAccessToken, handleVerifyToken);

// Verify token for associated account
router.post("/verify-email", handleVerifyEmailToken);

// Send verification link to a user
router.post("/resend-verification", handleResendVerification);

router.post("/forgot-password", handleForgetPassword);

router.post("/forgot-password/confirm-otp", handleVerifyOtp);

router.post('/forgot-password/resend-otp', handleResendOtp);

export default router;
