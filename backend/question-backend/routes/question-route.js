import express from "express";
import { createQuestion, deleteQuestion, updateQuestion, getAllQuestions, getQuestionById } from "../controllers/question-controller.js";

const router = express.Router();

router.post("/", createQuestion);
router.delete("/:id", deleteQuestion);
router.put("/:id", updateQuestion);
router.get("/", getAllQuestions);
router.get("/:id", getQuestionById);

export default router;