import { RequestHandler, Router } from 'express'
import { addMatch } from './createMatchController'

const router = Router()
router.post('/add-match', addMatch as unknown as RequestHandler)

export { router }