import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb'
import express, { Express } from 'express'

import mongoose from 'mongoose'
import config from '../../src/common/config.util'
import logger from '../../src/common/logger.util'
import connectToDatabase from '../../src/common/mongodb.util'
import questionRouter from '../../src/routes/question.routes'

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
        it('should return 200 OK', async () => {
            // Dummy Test
            expect(true).toBe(true)
        })
    })
})
