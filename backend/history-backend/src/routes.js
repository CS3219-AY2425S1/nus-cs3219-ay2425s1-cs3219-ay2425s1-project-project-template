import express from "express";
import { getHistory, addHistory, deleteHistory } from './controller.js';

const router = express.Router();

router.post("/", addHistory);
router.get("/:id", getHistory);
router.delete("/:id", deleteHistory);

export default router;