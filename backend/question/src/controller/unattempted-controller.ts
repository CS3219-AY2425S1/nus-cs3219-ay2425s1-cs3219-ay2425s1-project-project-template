// src/controllers/questionsController.ts
// src/controllers/unattempted-controller.ts
import { Request, Response } from 'express';

import { getUnattemptedOrLeastAttemptedQuestion } from '../services/get/getUnattempted';

// Define types for query parameters
interface UnattemptedQuestionQuery {
  userId1?: number;
  userId2?: number;
  topics?: string | string[];
  difficulty?: string;
}

export const fetchUnattemptedQuestion = async (
  req: Request<unknown, unknown, unknown, UnattemptedQuestionQuery>,
  res: Response
) => {
  // Parse userId1 as an integer
  const userId1 = req.query.userId1; // This is always a string from the query

  if (userId1 === undefined || isNaN(userId1)) {
    return res
      .status(400)
      .json({ error: 'Invalid or missing userId1. It must be a valid integer.' });
  }

  // Parse userId2 similarly
  const userId2 = req.query.userId2; // This is always a string from the query

  if (userId2 !== undefined && isNaN(userId2)) {
    return res
      .status(400)
      .json({ error: 'Invalid userId2. It must be a valid integer if provided.' });
  }

  // Ensure topics is an array of strings
  const topics =
    typeof req.query.topics === 'string'
      ? req.query.topics.split(',')
      : Array.isArray(req.query.topics)
        ? req.query.topics.filter((topic): topic is string => topic !== undefined)
        : undefined;

  const difficulty = req.query.difficulty;

  try {
    const question = await getUnattemptedOrLeastAttemptedQuestion(
      userId1,
      userId2,
      topics,
      difficulty
    );

    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ message: 'No unattempted questions found' });
    }
  } catch (error) {
    console.error('Error fetching unattempted question:', error); // Log the actual error
    res
      .status(500)
      .json({ error: 'Error fetching unattempted question', details: (error as any).message });
  }
};
