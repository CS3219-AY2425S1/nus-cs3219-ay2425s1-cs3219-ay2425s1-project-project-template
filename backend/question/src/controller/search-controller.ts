import { Request, Response } from 'express';
import { searchQuestionsByTitleService } from '../services/get/index';

export const searchQuestionsByTitle = async (req: Request, res: Response): Promise<Response> => {
  const { title } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!title) {
    return res.status(200).json({ message: 'Title is required' });
  }

  try {
    const result = await searchQuestionsByTitleService(title.toString(), page, limit);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred', error });
  }
};
