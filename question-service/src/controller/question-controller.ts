// import { Request, Response } from 'express';

// export const templateController = {
//   home: (req: Request, res: Response) => {
//     res.send('Welcome to Question Service!');
//   },
// };

import { Request, Response } from "express";
import Question from "../model/question-model";

export const questionController = {
  // Create a question
  createQuestion: async (req: Request, res: Response) => {
    const { title, description, category, complexity } = req.body;

    try {
      const question = new Question({
        title,
        description,
        category,
        complexity,
      });

      const savedQuestion = await question.save();
      res.status(201).json(savedQuestion);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to create question", error: err });
    }
  },

  // Get all questions
  getAllQuestions: async (req: Request, res: Response) => {
    try {
      const questions = await Question.find();
      res.status(200).json(questions);
    } catch (err) {
      res.status(500).json({ message: "Failed to get questions", error: err });
    }
  },

  // Get question by ID
  getQuestionById: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const question = await Question.findById(id);
      if (question) {
        res.status(200).json(question);
      } else {
        res.status(404).json({ message: "Question not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Failed to get question", error: err });
    }
  },

  // Update a question
  updateQuestion: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, category, complexity } = req.body;

    try {
      const updatedQuestion = await Question.findByIdAndUpdate(
        id,
        { title, description, category, complexity },
        { new: true }
      );
      if (updatedQuestion) {
        res.status(200).json(updatedQuestion);
      } else {
        res.status(404).json({ message: "Question not found" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to update question", error: err });
    }
  },

  // Delete a question
  deleteQuestion: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const deletedQuestion = await Question.findByIdAndDelete(id);
      if (deletedQuestion) {
        res.status(200).json({ message: "Question deleted successfully" });
      } else {
        res.status(404).json({ message: "Question not found" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to delete question", error: err });
    }
  },
};
