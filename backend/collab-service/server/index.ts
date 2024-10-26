import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import logger from '../utils/logger'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { router as submitCodeRouter } from '../submit-code/submitCodeRouter'

dotenv.config({ path: './.env' })

const app = express()
app.use(cors())
app.use(express.json())

app.use(submitCodeRouter)

const server = createServer(app)
const yDocMap = new Map()

const PORT = process.env.PORT

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})