import { Request, Response } from 'express';

import { addAttempt } from '../services/post/addAttempt';

// Define the expected request body structure
interface AddAttemptRequestBody {
  questionId: number;
  userId1: string;
  userId2?: string; // Optional if userId2 is not always required
  code: string;
  language: string;
}

// Controller function to handle creating an attempt
export const createAttempt = async (
  req: Request<unknown, unknown, AddAttemptRequestBody>,
  res: Response
) => {
  const { questionId, userId1, userId2, code, language } = req.body;

  // Basic validation for required fields
  if (!questionId || !userId1 || !code || !language) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Call the service function to add the attempt
    const result = await addAttempt({
      questionId,
      userId1,
      userId2,
      code,
      language,
    });

    // Respond with success
    res.status(201).json({ message: 'Attempt added successfully', result });
  } catch (error) {
    console.error('Error adding attempt:', error);

    // Enhanced error response with error details
    res.status(500).json({
      error: 'Error adding attempt',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
