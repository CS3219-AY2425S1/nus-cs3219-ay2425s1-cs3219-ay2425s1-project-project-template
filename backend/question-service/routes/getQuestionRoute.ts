import { Router } from 'express'
import { getQuestion } from '../controllers/getQuestionController'

const router = Router()
router.post('/get-question', getQuestion)

export { router }