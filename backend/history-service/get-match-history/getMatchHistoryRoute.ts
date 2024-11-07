import { RequestHandler, Router } from 'express'
import { getUserMatchHistory } from './getMatchHistoryController'

const router = Router()
router.get('/history', getUserMatchHistory as unknown as RequestHandler)

export { router }