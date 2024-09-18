import 'dotenv/config'
import http, { Server } from 'http'
import { connect } from 'mongoose'
import Winston, { Logger } from 'winston'
import index from './index'

// Setup Logger
export const logger: Logger = Winston.createLogger({
    level: 'info',
    format: Winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new Winston.transports.Console(),
        new Winston.transports.File({ filename: 'error.log', level: 'error' }),
        new Winston.transports.File({ filename: 'combined.log' }),
    ],
})

const port: string = process.env.PORT ?? '3000'
const dbUrl: string | undefined = process.env.DB_URL
if (!dbUrl) {
    logger.error(`[Init] DB_URL is not set`)
}

const server: Server = http.createServer(index)

connect(dbUrl!)
    .then(() => {
        logger.info(`[Init] Connected to MongoDB`)
    })
    .catch((error: Error) => {
        logger.error(`[Init] ${error.message}`)
    })

server.listen(port, async () => {
    logger.info(`[Init] Server is listening on port ${port}`)
})
