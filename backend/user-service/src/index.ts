import cors from 'cors'
import express, { Express, NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import { ResponseError } from './types/ResponseError'

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

app.get('/', (_: Request, response: Response) => {
    response
        .json({
            message: 'Hello World!',
        })
        .status(200)
})

// Handle When No Route Match Is Found
app.use((next: NextFunction) => {
    const error: ResponseError = new Error()
    error.status = 404
    next(error)
})

app.use((error: ResponseError, _: Request, response: Response) => {
    response.status(error.status ?? 500)
    response.json({
        error: {
            message: error.message,
        },
    })
})

export default app
