import { RequestHandler, Router } from 'express'
import { executeCodeController } from '../controllers/executeCodeController'

const router = Router()
router.post('/execute-code', executeCodeController as unknown as RequestHandler)

export { router }
