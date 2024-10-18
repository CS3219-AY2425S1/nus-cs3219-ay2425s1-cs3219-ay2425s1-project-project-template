import 'dotenv/config'
import config from './common/config.util'
import logger from './common/logger.util'
import connectToDatabase from './common/mongodb.util'
import connectToRabbitMQ from './common/rabbitmq.util'
import { server } from './services/ws.service'

connectToRabbitMQ()
connectToDatabase(config.DB_URL)

server.listen(config.PORT, async () => {
    logger.info(`[Init] Server is listening on port ${config.PORT}`)
})
