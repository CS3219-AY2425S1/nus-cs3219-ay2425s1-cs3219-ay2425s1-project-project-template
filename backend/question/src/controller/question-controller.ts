import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';

import {
  getQuestionsService,
  getQuestionDetailsService,
  getRandomQuestionService,
  searchQuestionsByTitleService,
} from '@/services/get/index';
import {
  ICreateQuestionPayload,
  IDeleteQuestionPayload,
  IUpdateQuestionPayload,
} from '../services/post/types';

import {
  createQuestionService,
  deleteQuestionService,
  updateQuestionService,
} from '../services/post';
import type {
  IGetQuestionsPayload,
  IGetQuestionPayload,
  IGetRandomQuestionPayload,
} from '@/services/get/types';

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
    if (!result.data || result.code >= 400) {
      return res.status(result.code).json({
        message: result.error?.message ?? 'An error occurred',
      });
    }
    return res.status(result.code).json(result.data);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'An error occurred', error });
  }
};

export const getQuestionDetails = async (req: Request, res: Response): Promise<Response> => {
  const payload: IGetQuestionPayload = {
    questionId: parseInt(req.params.questionId),
  };

  try {
    const result = await getQuestionDetailsService(payload);
    if (!result.data || result.code >= 400) {
      return res.status(result.code).json({
        message: result.error?.message ?? 'An error occurred',
      });
    }
    return res.status(result.code).json(result.data);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'An error occurred', error });
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
    console.log('error', error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'An error occurred', error });
  }
};

export const searchQuestionsByTitle = async (req: Request, res: Response): Promise<Response> => {
  const { title } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!title) {
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ success: false, message: 'Title is required' });
  }

  try {
    const result = await searchQuestionsByTitleService(title.toString(), page, limit);
    return res.status(result.code).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred', error });
  }
};

export const createQuestion = async (req: Request, res: Response): Promise<Response> => {
  const payload: ICreateQuestionPayload = {
    title: req.body.title,
    description: req.body.description,
    difficulty: req.body.difficulty,
    topics: req.body.topics,
  };

  try {
    const result = await createQuestionService(payload);
    return res.status(result.code).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred', error });
  }
};

export const updateQuestion = async (req: Request, res: Response): Promise<Response> => {
  const payload: IUpdateQuestionPayload = {
    id: parseInt(req.params.questionId),
    title: req.body.title,
    description: req.body.description,
    difficulty: req.body.difficulty,
    topics: req.body.topics,
  };

  try {
    const result = await updateQuestionService(payload);
    return res.status(result.code).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred', error });
  }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<Response> => {
  const payload: IDeleteQuestionPayload = {
    id: parseInt(req.params.questionId),
  };

  try {
    const result = await deleteQuestionService(payload);
    return res.status(result.code).json(result);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'An error occurred', error });
  }
};
