import express from "express";
import { createQuestion, findAllQuestions,  findQuestionById, findQuestionByTitleAndComplexity, updateQuestionById, deleteQuestionById } from "../controller/question-controller.js";
const router = express.Router();

router.get("/", findAllQuestions);
router.get("/:id", findQuestionById);
router.get("/:title/:complexity", findQuestionByTitleAndComplexity);
router.post("/", createQuestion);
router.patch("/:id", updateQuestionById);
router.delete("/:id", deleteQuestionById);

export default router;