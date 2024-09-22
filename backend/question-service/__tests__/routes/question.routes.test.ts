import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb'
import express, { Express } from 'express'
import 'express-async-errors'
import mongoose from 'mongoose'
import { QUESTION_BANK } from '../../__mocks__/question.mock'
import config from '../../src/common/config.util'
import logger from '../../src/common/logger.util'
import connectToDatabase from '../../src/common/mongodb.util'
import defaultErrorHandler from '../../src/middlewares/errorHandler.middleware'
import questionSchema from '../../src/models/question.model'
import questionRouter from '../../src/routes/question.routes'
import { IQuestion } from '../../src/types/IQuestion'

jest.mock('../../src/common/config.util', () => ({
    NODE_ENV: 'test',
    PORT: '3004',
    DB_URL: 'placeholder',
}))

describe('Question Routes', () => {
    let app: Express
    let startedContainer: StartedMongoDBContainer

    beforeAll(async () => {
        const container: MongoDBContainer = new MongoDBContainer().withExposedPorts(27017)
        startedContainer = await container.start()

        const connectionString = `${startedContainer.getConnectionString()}?directConnection=true`
        logger.info(`[Question Routes Test] MongoDB container started on ${connectionString}`)

        jest.replaceProperty(config, 'DB_URL', connectionString)

        app = express()
        app.use(express.json())
        app.use('/questions', questionRouter)
        app.use(defaultErrorHandler)

        await connectToDatabase(connectionString)
    }, 60000)

    afterAll(async () => {
        await startedContainer.stop()
        logger.info(`[Question Routes Test] MongoDB container stopped`)
    })

    afterEach(async () => {
        await mongoose.connection.db!.dropDatabase()
    })

    // Dummy test, remove when APIs are implemented
    it('should insert all questions', async () => {
        await mongoose.model<IQuestion>('Question', questionSchema).bulkWrite(
            QUESTION_BANK.map((question) => ({
                insertOne: {
                    document: question,
                },
            }))
        )
        const questions = await mongoose.model<IQuestion>('Question', questionSchema).find()
        expect(questions).toHaveLength(QUESTION_BANK.length)
    })

    describe('GET /questions', () => {
        it('should return 200 OK', async () => {
            // Dummy Test
            expect(true).toBe(true)
        })
    })
})
