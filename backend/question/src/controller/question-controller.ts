import { Request, Response } from 'express';
import {
  getQuestionsService,
  getQuestionDetailsService,
  getRandomQuestionService,
  searchQuestionsByTitleService,
} from '../services/get/index';
import {
  IGetQuestionsPayload,
  IGetQuestionPayload,
  IGetRandomQuestionPayload,
} from '../services/get/types';

export const getQuestions = async (req: Request, res: Response): Promise<Response> => {
  const payload: IGetQuestionsPayload = {
    questionName: req.query.questionName as string,
    difficulty: req.query.difficulty as string,
    topic: req.query.topic as string[],
    pageNum: parseInt(req.query.pageNum as string) || 0,
    recordsPerPage: parseInt(req.query.recordsPerPage as string) || 20,
  };

  try {
    const result = await getQuestionsService(payload);
    return res.status(result.code).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred', error });
  }
};

export const getQuestionDetails = async (req: Request, res: Response): Promise<Response> => {
  const payload: IGetQuestionPayload = {
    questionId: parseInt(req.params.questionId),
  };

  try {
    const result = await getQuestionDetailsService(payload);
    return res.status(result.code).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred', error });
  }
};

export const getRandomQuestion = async (req: Request, res: Response): Promise<Response> => {
  const payload: IGetRandomQuestionPayload = {
    attemptedQuestions: req.body.attemptedQuestions,
    difficulty: req.body.difficulty,
    topic: req.body.topic,
  };
  try {
    const result = await getRandomQuestionService(payload);
    return res.status(result.code).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred', error });
  }
};

export const searchQuestionsByTitle = async (req: Request, res: Response): Promise<Response> => {
  const { title } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  try {
    const result = await searchQuestionsByTitleService(title.toString(), page, limit);
    return res.status(result.code).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred', error });
  }
};
