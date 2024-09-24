import { Router } from 'express'
import { addQuestion } from '../controllers/addQuestionController'

const router = Router()
router.post('/add-question', addQuestion)

export { router }
