import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb'
import express, { Express } from 'express'

import { Proficiency } from '../../src/types/Proficiency'
import { Role } from '../../src/types/Role'
import connectToDatabase from '../../src/common/mongodb.util'
import logger from '../../src/common/logger.util'
import mongoose from 'mongoose'
import request from 'supertest'
import userRouter from '../../src/routes/user.routes'

describe('User Routes', () => {
    let app: Express
    let startedContainer: StartedMongoDBContainer

    const CREATE_USER_DTO1 = {
        username: 'test1',
        password: 'Test1234!',
        email: 'test@gmail.com',
        role: Role.ADMIN,
        proficiency: Proficiency.INTERMEDIATE,
    }

    const CREATE_USER_DTO2 = {
        username: 'test2',
        password: 'Test1234!',
        email: 'test2@gmail.com',
        role: Role.ADMIN,
        proficiency: Proficiency.INTERMEDIATE,
    }

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

    describe('POST /users/create', () => {
        it('should return 201 and return the new user', async () => {
            const response = await request(app).post('/users/create').send(CREATE_USER_DTO1)
            expect(response.status).toBe(201)
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    username: 'test1',
                    email: 'test@gmail.com',
                    role: Role.ADMIN,
                    proficiency: Proficiency.INTERMEDIATE,
                })
            )
        })
        it('should return 400 for invalid requests and a list of errors', async () => {
            const response = await request(app).post('/users/create').send({})
            expect(response.status).toBe(400)
            expect(response.body).toHaveLength(4)
        })
        it('should return 409 for duplicate username or email', async () => {
            await request(app).post('/users/create').send(CREATE_USER_DTO1)
            const response = await request(app).post('/users/create').send(CREATE_USER_DTO1)
            expect(response.status).toBe(409)
        })
    })

    describe('POST /users/update-profile', () => {
        it('should return 200 for successful update', async () => {
            const user1 = await request(app).post('/users/create').send(CREATE_USER_DTO1)
            const response = await request(app).post('/users/update-profile').send({
                id: user1.body.id,
                username: 'test3',
                proficiency: Proficiency.ADVANCED,
            })
            expect(response.status).toBe(200)
            expect(response.body.username).toEqual('test3')
            expect(response.body.proficiency).toEqual(Proficiency.ADVANCED)
        })
        it('should return 400 for invalid requests and a list of errors', async () => {
            const response = await request(app).post('/users/update-profile').send({})
            expect(response.status).toBe(400)
            expect(response.body).toHaveLength(2)
        })
        it('should return 409 for duplicate username', async () => {
            const user1 = await request(app).post('/users/create').send(CREATE_USER_DTO1)
            await request(app).post('/users/create').send(CREATE_USER_DTO2)
            const response = await request(app).post('/users/update-profile').send({
                id: user1.body.id,
                username: 'test2',
                proficiency: Proficiency.ADVANCED,
            })
            expect(response.status).toBe(409)
        })
    })
})
