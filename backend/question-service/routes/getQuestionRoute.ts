import { Router } from 'express'
import { getAllQuestions, getQuestionsById, getQuestionsByParams } from '../controllers/getQuestionController'

const router = Router()
router.get('/get-all-questions', getAllQuestions)
router.get('/get-questions-by-id/:questionId', getQuestionsById)
router.get('/get-questions-by-params/:categories/:difficulty', getQuestionsByParams)

export { router }