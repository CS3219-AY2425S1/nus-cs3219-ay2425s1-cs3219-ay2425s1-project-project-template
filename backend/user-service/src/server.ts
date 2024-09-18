import 'dotenv/config'
import http, { Server } from 'http'
import { connect } from 'mongoose'
import logger from './common/logger.util'
import index from './index'

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
