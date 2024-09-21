import cors from 'cors'
import express, { Express, NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import passport from 'passport'
import logger from './common/logger.util'
import authRouter from './routes/auth.routes'
import userRouter from './routes/user.routes'

const app: Express = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
app.use(helmet())

app.use(passport.initialize())

// To handle CORS Errors
app.use(async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    response.header('Access-Control-Allow-Origin', '*') // "*" -> Allow all links to access

    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    // Browsers usually send this before PUT or POST Requests
    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH')
        response.status(200).send()
        return
    }

    // Continue Route Processing
    next()
})

app.use('/auth', authRouter)
app.use('/users', userRouter)

// Health Check Route
app.get('/', async (_: Request, response: Response): Promise<void> => {
    response.status(200).send()
})

//  Not Found Route
app.use(async (_: Request, response: Response): Promise<void> => {
    response.status(404).send()
})

// Default Error Handler
app.use(async (error: Error, request: Request, response: Response): Promise<void> => {
    logger.error(`[Controller] [${request.method}  ${request.baseUrl + request.path}] ${error.message}`)
    response.status(500).send()
})

export default app
