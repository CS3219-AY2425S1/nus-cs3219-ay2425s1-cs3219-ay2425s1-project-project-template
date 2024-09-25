import { Request, Response } from 'express'
import Question from '../models/question'

const getAllQuestions = async (req: Request, res: Response) => {
  try {
      const retrievedQuestions = await Question.find({});

      if (!retrievedQuestions) {
          return res.status(400).send('No questions found.')
      }

      return res.status(200).json(retrievedQuestions);
  } catch (e) {
      return res.status(500).send('Error appeared when retrieving questions')
  }
}

const getQuestionsByParams = async (req: Request, res: Response) => {
    const { categories, difficulty } = req.params

    if (!categories && !difficulty) {
        return res.status(400).send('Categories or difficulty required.')
    }

    try {
        // does this work if either category or difficulty doesn't exist?
        const retrievedQuestions = await Question.findOne({
          $or: [ 
            { categories: { $in: categories }},
            { difficulty }
          ]
        });

        if (!retrievedQuestions) {
            return res.status(400).send('No such questions found.')
        }

        return res.status(200).json(retrievedQuestions);
    } catch (e) {
        return res.status(500).send('Error appeared when retreiving questions')
    }
}

const getQuestionsById = async (req: Request, res: Response) => {
  const { questionId } = req.params

  if (!questionId) {
    return res.status(400).send('Question ID required')
  }

  try {
      const retrievedQuestions = await Question.findById({});

      if (!retrievedQuestions) {
          return res.status(400).send('No questions with this ID found.')
      }

      return res.status(200).json(retrievedQuestions);
  } catch (e) {
      return res.status(500).send('Error appeared when retrieving questions')
  }
}

export { getAllQuestions, getQuestionsByParams, getQuestionsById }
