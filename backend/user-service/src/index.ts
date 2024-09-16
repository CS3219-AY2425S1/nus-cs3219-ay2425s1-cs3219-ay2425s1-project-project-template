import cors from 'cors'
import express, { Express, NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import { logger } from './server'

const app: Express = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
app.use(helmet())

// To handle CORS Errors
app.use((request: Request, response: Response, next: NextFunction) => {
    response.header('Access-Control-Allow-Origin', '*') // "*" -> Allow all links to access

    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    // Browsers usually send this before PUT or POST Requests
    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH')
        return response.status(200).json({})
    }

    // Continue Route Processing
    next()
})

// Health Check Route
app.get('/', (_: Request, response: Response) => {
    response.status(200)
})

//  Not Found Route
app.use((response: Response) => {
    response.status(404)
})

// Default Error Handler
app.use((error: Error, request: Request, response: Response) => {
    logger.error(`[Controller] [${request.method}  ${request.baseUrl + request.path}] ${error.message}`)
    response.status(500)
})

export default app
