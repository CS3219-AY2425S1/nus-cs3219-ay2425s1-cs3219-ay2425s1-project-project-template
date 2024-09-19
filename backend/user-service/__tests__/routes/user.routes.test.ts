import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb'
import express, { Express } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import logger from '../../src/common/logger.util'
import connectToDatabase from '../../src/common/mongodb.util'
import userRouter from '../../src/routes/user.routes'
import { Proficiency } from '../../src/types/Proficiency'
import { Role } from '../../src/types/Role'

describe('User Routes', () => {
    let app: Express
    let startedContainer: StartedMongoDBContainer

    beforeAll(async () => {
        const container: MongoDBContainer = new MongoDBContainer().withExposedPorts(27017)
        startedContainer = await container.start()

        const connectionString = `${startedContainer.getConnectionString()}?directConnection=true`
        logger.info(`[User Routes Test] MongoDB container started on ${connectionString}`)

        app = express()
        app.use(express.json())
        app.use('/users', userRouter)

        await connectToDatabase(connectionString)
    }, 60000)

    afterAll(async () => {
        await startedContainer.stop()
        logger.info(`[User Routes Test] MongoDB container stopped`)
    })

    afterEach(async () => {
        await mongoose.connection.db!.dropDatabase()
    })

    describe('POST /users', () => {
        const CREATE_USER_DTO = {
            username: 'test',
            password: 'Test1234!',
            email: 'test@gmail.com',
            role: Role.ADMIN,
            proficiency: Proficiency.INTERMEDIATE,
        }
        it('should return 201 and return the new user', async () => {
            const response = await request(app).post('/users').send(CREATE_USER_DTO)
            expect(response.status).toBe(201)
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    username: 'test',
                    email: 'test@gmail.com',
                    role: Role.ADMIN,
                    proficiency: Proficiency.INTERMEDIATE,
                })
            )
        })
        it('should return 400 for invalid requests and a list of errors', async () => {
            const response = await request(app).post('/users').send({})
            expect(response.status).toBe(400)
            expect(response.body).toHaveLength(4)
        })
        it('should return 409 for duplicate username or email', async () => {
            await request(app).post('/users').send(CREATE_USER_DTO)
            const response = await request(app).post('/users').send(CREATE_USER_DTO)
            expect(response.status).toBe(409)
        })
    })
})
