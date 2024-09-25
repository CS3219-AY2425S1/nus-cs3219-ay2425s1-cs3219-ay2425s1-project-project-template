import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb'
import express, { Express } from 'express'
import 'express-async-errors'
import mongoose from 'mongoose'
import { agent, Agent } from 'supertest'
import { QUESTION_BANK } from '../../__mocks__/question.mock'
import logger from '../../src/common/logger.util'
import connectToDatabase from '../../src/common/mongodb.util'
import defaultErrorHandler from '../../src/middlewares/errorHandler.middleware'
import questionSchema from '../../src/models/question.model'
import questionRouter from '../../src/routes/question.routes'
import { Category } from '../../src/types/Category'
import { Complexity } from '../../src/types/Complexity'
import { IQuestion } from '../../src/types/IQuestion'
import { QuestionDto } from '../../src/types/QuestionDto'

jest.mock('../../src/common/config.util', () => ({
    NODE_ENV: 'test',
    PORT: '3004',
    DB_URL: 'placeholder',
}))

describe('Question Routes', () => {
    let app: Express
    let testAgent: Agent
    let startedContainer: StartedMongoDBContainer

    beforeAll(async () => {
        const container: MongoDBContainer = new MongoDBContainer().withExposedPorts(27017)
        startedContainer = await container.start()

        const connectionString = `${startedContainer.getConnectionString()}?directConnection=true`
        logger.info(`[Question Routes Test] MongoDB container started on ${connectionString}`)

        app = express()
        app.use(express.json())
        app.use('/questions', questionRouter)
        app.use(defaultErrorHandler)

        testAgent = agent(app)

        await connectToDatabase(connectionString)
    }, 60000)

    afterAll(async () => {
        await startedContainer.stop()
        logger.info(`[Question Routes Test] MongoDB container stopped`)
    })

    afterEach(async () => {
        await mongoose.connection.db!.dropDatabase()
    })
    describe('GET /questions', () => {
        beforeEach(async () => {
            await mongoose.model<IQuestion>('Question', questionSchema).bulkWrite(
                QUESTION_BANK.map((question) => ({
                    insertOne: {
                        document: question,
                    },
                }))
            )
            await mongoose.model<IQuestion>('Question', questionSchema).createIndexes()
        })

        it('should return 200 OK and a list of all the questions with the pagination information', async () => {
            const queryParams = {
                page: '1',
                limit: '10',
            }
            const {
                status,
                body: { pagination, questions },
            } = await testAgent.get('/questions').query(queryParams)
            expect(status).toBe(200)
            expect(pagination).toEqual({
                currentPage: 1,
                nextPage: 2,
                totalPages: Math.ceil(QUESTION_BANK.length / 10),
                totalItems: QUESTION_BANK.length,
            })
            expect(questions).toHaveLength(10)
        })

        it('should return 400 BAD REQUEST when the page or limit query parameter is not a number', async () => {
            const queryParams = {
                page: 'invalid',
                limit: '10',
            }
            const { status } = await testAgent.get('/questions').query(queryParams)
            expect(status).toBe(400)
        })

        it('should return 400 BAD REQUEST when the filter parameters are invalid', async () => {
            const queryParams = {
                page: '1',
                limit: '10',
                filterBy: 'invalid:invalid',
            }
            const { status } = await testAgent.get('/questions').query(queryParams)
            expect(status).toBe(400)
        })

        it('should return 400 BAD REQUEST when the sort parameters are invalid', async () => {
            const queryParams = {
                page: '1',
                limit: '10',
                sortBy: 'invalid:invalid',
            }
            const { status } = await testAgent.get('/questions').query(queryParams)
            expect(status).toBe(400)
        })

        it('should return 200 OK and a list of filtered questions when a valid title search parameter is provided', async () => {
            const queryParams = {
                page: '1',
                limit: '20',
                filterBy: 'title:a',
            }
            const {
                status,
                body: { questions },
            } = await testAgent.get('/questions').query(queryParams)
            expect(status).toBe(200)
            expect(questions).toHaveLength(QUESTION_BANK.filter((q) => q.title.includes('a')).length)
        })

        it('should return 200 OK and a list of filtered questions when a valid filter parameter is provided', async () => {
            const queryParams = {
                page: '1',
                limit: '20',
                filterBy: 'title:a,categories:ALGORITHMS',
            }
            const {
                status,
                body: { questions },
            } = await testAgent.get('/questions').query(queryParams)
            expect(status).toBe(200)
            expect(questions).toHaveLength(
                QUESTION_BANK.filter((q) => q.title.includes('a') && q.categories.includes(Category.ALGORITHMS)).length
            )
        })

        it('should return 200 OK and a list of sorted questions when a valid sort parameter is provided', async () => {
            const queryParams = {
                page: '1',
                limit: '20',
                sortBy: 'complexity:asc',
            }
            const {
                status,
                body: { questions },
            } = await testAgent.get('/questions').query(queryParams)
            expect(status).toBe(200)
            const isSorted = questions.every(
                (question: QuestionDto, index: number) =>
                    index === 0 ||
                    Object.values(Complexity).indexOf(question.complexity) >=
                        Object.values(Complexity).indexOf(questions[index - 1].complexity)
            )
            expect(isSorted).toBe(true)
        })
    })
})
