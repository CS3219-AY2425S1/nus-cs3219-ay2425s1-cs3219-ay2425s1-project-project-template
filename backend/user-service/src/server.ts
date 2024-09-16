import 'dotenv/config'
import http, { Server } from 'http'
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

const server: Server = http.createServer(index)

server.listen(port, async () => {
    logger.info(`[Init] Server is listening on port ${port}`)
})
