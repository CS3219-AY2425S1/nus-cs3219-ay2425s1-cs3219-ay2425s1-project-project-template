import express from "express";

import { handleLogin, handleVerifyToken, handleVerifyAccountToken } from "../controller/auth-controller.js";
import { verifyAccessToken } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/login", handleLogin);

router.get("/verify-token", verifyAccessToken, handleVerifyToken);

router.post("/verify-account", handleVerifyAccountToken);

export default router;
