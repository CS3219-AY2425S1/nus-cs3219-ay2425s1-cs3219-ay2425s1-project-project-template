import express from "express";
import { getHistory, getSomeHistory, addHistory, deleteHistory } from './controller.js';

const router = express.Router();

router.post("/single/", addHistory);
router.get("/single/:id", getHistory);
router.delete("/single/:id", deleteHistory);

router.get("/bulk", getSomeHistory);

export default router;