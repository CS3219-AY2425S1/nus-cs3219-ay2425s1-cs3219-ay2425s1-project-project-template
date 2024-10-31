import { connect } from 'mongoose'
import { autoInsertQuestions } from './autoinsert.util'
import config from './config.util'
import logger from './logger.util'

export default async (connectionString: string): Promise<void> => {
    await connect(connectionString, {
        autoCreate: config.NODE_ENV !== 'production',
        autoIndex: config.NODE_ENV !== 'production',
    })
        .then(async () => {
            logger.info(`[Init] Connected to database`)
            await autoInsertQuestions()
        })
        .catch((error: Error) => {
            logger.error(`[Init] Failed to connect to database: ${error.message}`)
        })
}
