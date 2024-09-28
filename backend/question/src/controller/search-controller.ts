import { Request, Response } from 'express';
import { searchQuestionsByTitleService } from '../services/get/index';

export const searchQuestionsByTitle = async (req: Request, res: Response): Promise<Response> => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const result = await searchQuestionsByTitleService(title.toString());
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred', error });
  }
};
