import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb'
import request from 'supertest'
import app from '../src/index'

describe('Index', () => {
    let startedContainer: StartedMongoDBContainer

    beforeAll(async () => {
        const container: MongoDBContainer = new MongoDBContainer().withExposedPorts(27017)
        startedContainer = await container.start()
        process.env.DB_URL = `mongodb://${startedContainer.getHost()}:${startedContainer.getMappedPort(27017)}/user-service`
    })

    afterAll(async () => {
        await startedContainer.stop()
    })

    describe('GET /', () => {
        it('should return 200 OK', async () => {
            const response = await request(app).get('/')
            expect(response.status).toBe(200)
        })
    })
})
