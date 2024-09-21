import { connect } from 'mongoose'
import logger from './logger.util'

export default async (connectionString: string): Promise<void> => {
    await connect(connectionString)
        .then(() => {
            logger.info(`[Init] Connected to database`)
        })
        .catch((error: Error) => {
            logger.error(`[Init] Failed to connect to database: ${error.message}`)
        })
}
