import express from "express";

import { handleLogin, handleVerifyToken } from "../controller/auth-controller.js";
import { verifyAccessToken } from "../middleware/basic-access-control.js";

const router = express.Router();

router.get("/verify-token", verifyAccessToken, handleVerifyToken);

router.post("/login", handleLogin);

export default router;
