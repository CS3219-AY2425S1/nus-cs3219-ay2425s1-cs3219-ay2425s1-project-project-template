import { Router } from 'express'
import { updateMatch } from './updateMatchController'

const router = Router()
router.patch('/update-match', updateMatch)

export { router }