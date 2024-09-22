import 'express-async-errors'

import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb'
import express, { Express } from 'express'

import { Proficiency } from '../../src/types/Proficiency'
import { Role } from '../../src/types/Role'
import config from '../../src/common/config.util'
import connectToDatabase from '../../src/common/mongodb.util'
import defaultErrorHandler from '../../src/middlewares/errorHandler.middleware'
import { generateKeyPairSync } from 'crypto'
import logger from '../../src/common/logger.util'
import mongoose from 'mongoose'
import request from 'supertest'
import userRouter from '../../src/routes/user.routes'

jest.mock('../../src/common/config.util', () => ({
    NODE_ENV: 'test',
    PORT: '3002',
    DB_URL: 'placeholder',
    ACCESS_TOKEN_PRIVATE_KEY: 'placeholder',
    ACCESS_TOKEN_PUBLIC_KEY: 'placeholder',
}))

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

        const { publicKey, privateKey } = generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        })

        jest.replaceProperty(config, 'ACCESS_TOKEN_PRIVATE_KEY', Buffer.from(privateKey).toString('base64'))
        jest.replaceProperty(config, 'ACCESS_TOKEN_PUBLIC_KEY', Buffer.from(publicKey).toString('base64'))
        jest.replaceProperty(config, 'DB_URL', connectionString)

        app = express()
        app.use(express.json())
        app.use('/users', userRouter)
        app.use(defaultErrorHandler)

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
        it('should return 201 and return the new user', async () => {
            const response = await request(app).post('/users').send(CREATE_USER_DTO1)
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
            const response = await request(app).post('/users').send({})
            expect(response.status).toBe(400)
            expect(response.body).toHaveLength(4)
        })
        it('should return 409 for duplicate username or email', async () => {
            await request(app).post('/users').send(CREATE_USER_DTO1)
            const response = await request(app).post('/users').send(CREATE_USER_DTO1)
            expect(response.status).toBe(409)
        })
    })

    describe('PUT /users/:id', () => {
        it('should return 200 for successful update', async () => {
            const user1 = await request(app).post('/users').send(CREATE_USER_DTO1)
            const response = await request(app).put(`/users/${user1.body.id}`).send({
                username: 'test3',
                proficiency: Proficiency.ADVANCED,
            })
            expect(response.status).toBe(200)
            expect(response.body.username).toEqual('test3')
            expect(response.body.proficiency).toEqual(Proficiency.ADVANCED)
        })
        it('should return 400 for requests with invalid ids', async () => {
            const response = await request(app).put('/users/111').send({
                username: 'test3',
                proficiency: Proficiency.ADVANCED,
            })
            expect(response.status).toBe(400)
        })
        it('should return 400 for invalid requests and a list of errors', async () => {
            const response = await request(app).put('/users/111').send({})
            expect(response.status).toBe(400)
        })
        it('should return 409 for duplicate username', async () => {
            const user1 = await request(app).post('/users').send(CREATE_USER_DTO1)
            await request(app).post('/users').send(CREATE_USER_DTO2)
            const response = await request(app).put(`/users/${user1.body.id}`).send({
                username: 'test2',
                proficiency: Proficiency.ADVANCED,
            })
            expect(response.status).toBe(409)
        })
    })

    describe('DELETE /users/:id', () => {
        it('should return 200 for successful deletion', async () => {
            const user1 = await request(app).post('/users').send(CREATE_USER_DTO1)
            const response = await request(app).delete(`/users/${user1.body.id}`).send()
            expect(response.status).toBe(200)
            const confirmation = await request(app).delete('/users/${user1.body.id}').send()
            expect(confirmation.status).toBe(400)
        })
        it('should return 400 for requests with invalid ids', async () => {
            const response = await request(app).delete('/users/111').send()
            expect(response.status).toBe(400)
        })
    })

    describe('PUT /users/password/:id', () => {
        it('should return 200 for successful update', async () => {
            const user1 = await request(app).post('/users').send(CREATE_USER_DTO1)
            const response = await request(app).put(`/users/password/${user1.body.id}`).send({
                password: 'Test12345!',
            })
            expect(response.status).toBe(200)
            expect(response.body.password).not.toEqual(user1.body.password)
        })
        it('should return 400 for requests with invalid ids', async () => {
            const response = await request(app).put('/users/password/111').send()
            expect(response.status).toBe(400)
        })
        it('should return 400 for requests with invalid passwords', async () => {
            const user1 = await request(app).post('/users').send(CREATE_USER_DTO1)
            const response = await request(app).put(`/users/password/${user1.body.id}`).send({
                password: 'Test1234',
            })
            expect(response.status).toBe(400)
            expect(response.body).toHaveLength(1)
        })
    })
})
