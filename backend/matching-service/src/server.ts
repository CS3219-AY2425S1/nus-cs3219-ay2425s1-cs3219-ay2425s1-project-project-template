import 'dotenv/config'
import http, { Server } from 'http'
import config from './common/config.util'
import logger from './common/logger.util'
import connectToDatabase from './common/mongodb.util'
import index from './index'
import connectToRabbitMQ from './common/rabbitmq.util'
import { WebSocketConnection } from './services/ws.service'

connectToRabbitMQ()
connectToDatabase(config.DB_URL)

const server: Server = http.createServer(index)
const wsConnection = new WebSocketConnection(server)

server.listen(config.PORT, async () => {
    logger.info(`[Init] Server is listening on port ${config.PORT}`)
})

export default wsConnection
