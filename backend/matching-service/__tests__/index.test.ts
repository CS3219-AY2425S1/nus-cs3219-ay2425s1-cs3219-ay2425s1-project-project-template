import request from 'supertest'
import configMock from '../__mocks__/config.mock'
import app from '../src/index'

jest.mock('../src/common/config.util', () => configMock)
jest.mock('../src/common/rabbitmq.util', () => () => {})
jest.mock('../src/services/rabbitmq.service', () => {})

describe('Index', () => {
    describe('GET /', () => {
        it('should return 200 OK', async () => {
            const response = await request(app).get('/')
            expect(response.status).toBe(200)
        })
    })
})
