import { Router, Request, Response } from "express";
import Question from "../models/question";

const router: Router = Router();

// Create a new question (POST)
router.post("/", async (req: Request, res: Response) => {
  const { questionId, title, description, categories, complexity, link } =
    req.body;

  try {
    const newQuestion = new Question({
      questionId,
      title,
      description,
      categories,
      complexity,
      link,
    });
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Get all questions (GET)
router.get("/", async (req: Request, res: Response) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get a single question by ID (GET)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const question = await Question.findOne({
      questionId: id,
    });
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Update a question by ID (PUT)
router.put("/:id", async (req: Request, res: Response) => {
  const { title, description, categories, complexity } = req.body;

  try {
    const id = Number(req.params.id);
    const updatedQuestion = await Question.findOneAndUpdate(
      { questionId: id },
      { title, description, categories, complexity },
      { new: true }
    );
    if (!updatedQuestion)
      return res.status(404).json({ error: "Question not found" });
    res.json(updatedQuestion);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Delete a question by ID (DELETE)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deletedQuestion = await Question.findOneAndDelete({
      questionId: id,
    });
    if (!deletedQuestion)
      return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
