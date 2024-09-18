import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb'
import request from 'supertest'
import logger from '../src/common/logger.util'
import app from '../src/index'

describe('Index', () => {
    let startedContainer: StartedMongoDBContainer

    beforeAll(async () => {
        const container: MongoDBContainer = new MongoDBContainer().withExposedPorts(27017)
        startedContainer = await container.start()
        logger.info(
            `[Index Test] MongoDB container started on ${startedContainer.getHost()}:${startedContainer.getMappedPort(27017)}`
        )
        process.env.DB_URL = `mongodb://${startedContainer.getHost()}:${startedContainer.getMappedPort(27017)}/user-service`
    })

    afterAll(async () => {
        await startedContainer.stop()
        logger.info(`[Index Test] MongoDB container stopped`)
    })

    describe('GET /', () => {
        it('should return 200 OK', async () => {
            const response = await request(app).get('/')
            expect(response.status).toBe(200)
        })
    })
})
