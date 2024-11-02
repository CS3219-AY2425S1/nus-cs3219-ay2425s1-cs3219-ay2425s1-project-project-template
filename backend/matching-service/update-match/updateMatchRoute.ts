import { Router } from 'express'
import { updateMatch } from './updateMatchController'

const router = Router()
router.patch('/add-match', updateMatch)

export { router }