import { Router } from 'express'
import { deleteQuestion } from '../controllers/deleteQuestionController'

const router = Router()
router.delete('/delete-question/:questionId', deleteQuestion)

export { router }
