import express from "express";
import {getAllQuestions, getOneQuestion, addQuestion, deleteQuestion, updateQuestion} from "../controllers/questionController"

const router = express.Router();

router.get("/", getAllQuestions);

router.get("/:qid", getOneQuestion);

router.post("/", addQuestion);

router.delete("/:qid", deleteQuestion);

router.patch("/:qid", updateQuestion)

export default router;