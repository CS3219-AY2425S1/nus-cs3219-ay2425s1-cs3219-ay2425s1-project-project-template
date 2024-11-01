import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getOpenAIResponse } from '@/service/post/openai-service';

export async function queryOpenAI(req: Request, res: Response) {
  const { messages } = req.body;

  // Ensure 'messages' array is provided
  if (!messages || !Array.isArray(messages)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Invalid request: messages array is required.',
    });
  }

  try {
    const result = await getOpenAIResponse(messages);

    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'An error occurred while querying OpenAI',
      error: err,
    });
  }
}
