import 'dotenv/config'
import http, { Server } from 'http'
import index from './index'

const port: string = process.env.PORT ?? '3000'

const server: Server = http.createServer(index)

server.listen(port, async () => {
    console.log(`Server is listening on port ${port}`)
})
