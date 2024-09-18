import 'dotenv/config'
import http, { Server } from 'http'
import logger from './common/logger.util'
import connectToDatabase from './common/mongodb.util'
import index from './index'

const port: string = process.env.PORT ?? '3000'
const server: Server = http.createServer(index)
server.listen(port, async () => {
    logger.info(`[Init] Server is listening on port ${port}`)
})

const connectionString: string | undefined = process.env.DB_URL
if (!connectionString) {
    logger.error(`[Init] DB_URL is not set`)
    process.exit(1)
}

connectToDatabase(connectionString)
