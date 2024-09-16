import express from "express";
import {getAllQuestions, getOneQuestion, addQuestion, deleteQuestion, updateQuestion} from "../controllers/questionController"
import { ValidateBodyForCreation } from "../utils/validation";

const router = express.Router();

router.get("/", getAllQuestions);

router.get("/:qid", getOneQuestion);

router.post("/", ValidateBodyForCreation(), addQuestion);

router.delete("/:qid", deleteQuestion);

router.patch("/:qid", updateQuestion)

export default router;