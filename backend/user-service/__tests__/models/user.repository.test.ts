import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb'
import logger from '../../src/common/logger.util'
import connectToDatabase from '../../src/common/mongodb.util'
import { findOneUserByUsername } from '../../src/models/user.repository'

describe('UserRepository', () => {
    let startedContainer: StartedMongoDBContainer

    beforeAll(async () => {
        const container: MongoDBContainer = new MongoDBContainer().withExposedPorts(27017)
        startedContainer = await container.start()

        const connectionString = `${startedContainer.getConnectionString()}?directConnection=true`
        logger.info(`[Index Test] MongoDB container started on ${connectionString}`)

        await connectToDatabase(connectionString)
    }, 60000)

    afterAll(async () => {
        await startedContainer.stop()
        logger.info(`[Index Test] MongoDB container stopped`)
    })

    describe('findOneUserByUsername', () => {
        it('should return null when no user found', async () => {
            const user = await findOneUserByUsername('')
            expect(user).toBeNull()
        })
    })
})
