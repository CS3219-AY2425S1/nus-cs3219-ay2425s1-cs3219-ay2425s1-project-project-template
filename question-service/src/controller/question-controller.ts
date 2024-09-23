// import { Request, Response } from 'express';

// export const templateController = {
//   home: (req: Request, res: Response) => {
//     res.send('Welcome to Question Service!');
//   },
// };

import { Request, Response } from "express";
import Question from "../model/question-model";
import { uploadToS3, deleteFromS3 } from "../config/s3";

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

    if (!templateCode || !testCases /*|| !Array.isArray(testCases)*/) {
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

      // Parse the testCases if they are sent as a JSON string
      // if (typeof req.body.testCases === "string") {
      //   req.body.testCases = JSON.parse(req.body.testCases);
      // }

      // // Handle image upload if present
      // let updatedDescription = description;
      // if (req.files) {
      //   const files = req.files as Express.Multer.File[];
      //   for (const file of files) {
      //     const imageUrl = await uploadToS3(file);
      //     updatedDescription += `\n![Image](${imageUrl})`; // Append image URL at the end of description
      //   }
      // }

      const question = new Question({
        title: title,
        // description: updatedDescription,
        description: description,
        category: category,
        complexity: complexity,
        templateCode: templateCode,
        testCases: req.body.testCases,
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
        sort,
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

      // // Default sorting
      // let sortOptions: any = {};

      // // Sorting by title
      // if (sort === "title" || sort === "-title") {
      //   sortOptions.title = sort === "title" ? 1 : -1; // Ascending for 'title', descending for '-title'
      // }

      // // Sorting by complexity using numerical values for custom ordering
      // if (sort === "complexity" || sort === "-complexity") {
      //   const complexityOrder = { Easy: 1, Medium: 2, Hard: 3 };
      //   sortOptions.complexity =
      //     sort === "complexity"
      //       ? complexityOrder
      //       : { Easy: -1, Medium: -2, Hard: -3 };
      // }

      // Fetch only the fields you need: question_id, title, category, complexity
      const questions = await Question.find(filter)
        .select("question_id title category complexity") // Specify fields to fetch
        // .sort(sortOptions) // Apply sorting
        .skip(skip)
        .limit(limit);

      // Define complexity order for sorting
      const complexityOrder: { [key: string]: number } = {
        Easy: 1,
        Medium: 2,
        Hard: 3,
      };

      // Apply sorting in the application layer
      if (sort === "complexity") {
        questions.sort((a: any, b: any) => {
          return complexityOrder[a.complexity] - complexityOrder[b.complexity];
        });
      } else if (sort === "-complexity") {
        questions.sort((a: any, b: any) => {
          return complexityOrder[b.complexity] - complexityOrder[a.complexity];
        });
      } else if (sort === "title") {
        questions.sort((a: any, b: any) => a.title.localeCompare(b.title)); // Ascending
      } else if (sort === "-title") {
        questions.sort((a: any, b: any) => b.title.localeCompare(a.title)); // Descending
      }

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

    if (!templateCode /*|| !testCases || !Array.isArray(testCases)*/) {
      return res
        .status(400)
        .json({ error: "Invalid input for template code or test cases" });
    }

    try {
      // const updatedQuestion = await Question.findOneAndUpdate(
      //   { question_id: id },
      //   { title, description, category, complexity, templateCode, testCases },
      //   { new: true } // Return the updated document
      // );

      const question = await Question.findOne({ question_id: id });
      if (!question)
        return res.status(404).json({ message: "Question not found" });

      // let updatedDescription = description;
      // if (req.files) {
      //   const files = req.files as Express.Multer.File[];
      //   for (const file of files) {
      //     const imageUrl = await uploadToS3(file);
      //     updatedDescription += `\n![Image](${imageUrl})`; // Append new image URL to description
      //   }
      // }

      question.title = title || question.title;
      // question.description = updatedDescription || question.description;
      question.description = description || question.description;
      question.category = category || question.category;
      question.complexity = complexity || question.complexity;
      question.templateCode = templateCode || question.templateCode;
      question.testCases = testCases || question.testCases;

      await question.save();
      res.status(200).json(question);
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
      const question = await Question.findOne({ question_id: id });
      if (!question)
        return res.status(404).json({ message: "Question not found" });
      // const deletedQuestion = await Question.findOneAndDelete({
      //   question_id: id,
      // });

      // // Extract image URLs from the description and delete them from S3
      // const imageUrls = question.description
      //   .match(/!\[Image]\((.*?)\)/g)
      //   ?.map((img) => img.slice(9, -1));
      // if (imageUrls) {
      //   for (const imageUrl of imageUrls) {
      //     const key = imageUrl.split("/").pop() as string;
      //     await deleteFromS3(key);
      //   }
      // }

      await question.delete();
      res.status(200).json({ message: "Question deleted successfully" });

      // if (deletedQuestion) {
      //   res.status(200).json({ message: "Question deleted successfully" });
      // } else {
      //   res.status(404).json({ message: "Question not found" });
      // }
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to delete question", error: err });
    }
  },

  // Get all unique categories (topics)
  getAllUniqueCategories: async (req: Request, res: Response) => {
    try {
      // Use MongoDB's distinct to retrieve unique category values
      const uniqueCategories = await Question.distinct("category");

      res.status(200).json({ uniqueCategories });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to get unique categories", error: err });
    }
  },

  // Get all unique complexity levels
  getAllUniqueComplexityLevels: async (req: Request, res: Response) => {
    try {
      // Use MongoDB's distinct to retrieve unique complexity values
      const uniqueComplexityLevels = await Question.distinct("complexity");

      res.status(200).json({ uniqueComplexityLevels });
    } catch (err) {
      res
        .status(500)
        .json({
          message: "Failed to get unique complexity levels",
          error: err,
        });
    }
  },
};
