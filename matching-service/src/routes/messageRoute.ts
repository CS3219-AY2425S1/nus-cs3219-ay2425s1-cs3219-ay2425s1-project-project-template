import express from "express";
import { returnPing } from "../controller/messageController";

const router = express.Router();

router.get("/ping", returnPing);

export default router;
