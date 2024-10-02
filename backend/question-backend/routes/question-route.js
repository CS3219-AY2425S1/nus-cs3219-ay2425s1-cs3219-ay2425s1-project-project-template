import express from "express";
import { createQuestion, deleteQuestion, updateQuestion, getAllQuestions, getQuestionById } from "../controllers/question-controller.js";
import { verifyAccessToken, verifyIsAdmin } from "../../user-backend/middleware/basic-access-control.js";   

const router = express.Router();

router.post("/", verifyAccessToken, verifyIsAdmin, createQuestion);
router.delete("/:id", verifyAccessToken, verifyIsAdmin, deleteQuestion);
router.put("/:id", verifyAccessToken, verifyIsAdmin, updateQuestion);
router.get("/", verifyAccessToken, getAllQuestions);
router.get("/:id", verifyAccessToken, getQuestionById);

export default router;