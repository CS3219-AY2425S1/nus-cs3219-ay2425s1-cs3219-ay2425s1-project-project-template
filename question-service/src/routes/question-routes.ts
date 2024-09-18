// import { Router } from 'express';
// import { templateController } from '../controller/template-controller';

// const router = Router();

// router.get('/', templateController.home);

// export default router;

import { Router } from "express";
import { questionController } from "../controller/question-controller";
import authMiddleware from "../middleware/question-middleware";

const router = Router();

// Route to create a question
router.post("/", authMiddleware, questionController.createQuestion);

// Route to get all questions
router.get("/", questionController.getAllQuestions);

// Route to get a question by ID
router.get("/:id", authMiddleware, questionController.getQuestionById);

// Route to update a question
router.put("/:id", authMiddleware, questionController.updateQuestion);

// Route to delete a question
router.delete("/:id", authMiddleware, questionController.deleteQuestion);

export default router;
