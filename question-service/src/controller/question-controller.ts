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
    const {
      title,
      description,
      category,
      complexity,
      templateCode,
      testCases,
    } = req.body;

    // Check if all fields are provided
    if (!title || !description || !category || !complexity) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!templateCode || !testCases || !Array.isArray(testCases)) {
      return res
        .status(400)
        .json({ error: "Invalid input for template code or test cases" });
    }

    try {
      // Check for duplicates based on the question title
      const existingQuestion = await Question.findOne({ title });
      if (existingQuestion) {
        return res
          .status(400)
          .json({ error: "A question with this title already exists." });
      }

      const question = new Question({
        title,
        description,
        category,
        complexity,
        templateCode,
        testCases,
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
      const {
        question_id,
        title,
        // description,
        category,
        complexity,
        // templateCode,
        // testCase,
        // testCaseInput,
        // testCaseOutput,
      } = req.query;

      // Set default values for pagination
      const page = parseInt(req.query.page as string) || 1; // default to page 1
      const limit = parseInt(req.query.limit as string) || 10; // default to 10 items per page
      const skip = Number(page - 1) * Number(limit);

      // Construct the filter object dynamically based on provided query params
      const filter: any = {};

      if (question_id) {
        filter.question_id = question_id;
      }
      if (title) {
        filter.title = { $regex: title, $options: "i" }; // Case-insensitive search
      }
      // if (description) {
      //   filter.description = { $regex: description, $options: "i" };
      // }
      if (category) {
        filter.category = {
          $in: Array.isArray(category) ? category : [category],
        };
      }
      if (complexity) {
        filter.complexity = complexity;
      }
      // if (templateCode) {
      //   filter.templateCode = { $regex: templateCode, $options: "i" };
      // }

      // // Fetch the filtered and paginated results
      // const questions = await Question.find(filter)
      //   .skip(skip)
      //   .limit(Number(limit));

      // Fetch only the fields you need: question_id, title, category, complexity
      const questions = await Question.find(filter)
        .select("question_id title category complexity") // Specify fields to fetch
        .skip(skip)
        .limit(limit);

      // Count total number of documents matching the filter
      const totalQuestions = await Question.countDocuments(filter);
      res.status(200).json({
        questions,
        totalQuestions,
        currentPage: page,
        totalPages: Math.ceil(totalQuestions / limit),
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to get questions", error: err });
    }
  },

  // Get question by ID
  getQuestionById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const question = await Question.findOne({ question_id: id });
      if (question) {
        res.status(200).json({ question });
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
    const {
      title,
      description,
      category,
      complexity,
      templateCode,
      testCases,
    } = req.body;

    // Check if all fields are provided
    if (!title || !description || !category || !complexity) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!templateCode || !testCases || !Array.isArray(testCases)) {
      return res
        .status(400)
        .json({ error: "Invalid input for template code or test cases" });
    }

    try {
      const updatedQuestion = await Question.findOneAndUpdate(
        { question_id: id },
        { title, description, category, complexity, templateCode, testCases },
        { new: true } // Return the updated document
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
    try {
      const { id } = req.params;
      const deletedQuestion = await Question.findOneAndDelete({
        question_id: id,
      });
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
