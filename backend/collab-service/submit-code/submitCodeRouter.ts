import { Router } from 'express'
import { submitCode } from './submitCodeController'

const router = Router()
router.post('/submit-code', submitCode)

export { router }