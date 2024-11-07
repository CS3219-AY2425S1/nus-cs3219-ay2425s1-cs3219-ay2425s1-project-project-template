import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import logger from "../utils/logger"
import { connectToDatabase } from "./db"

dotenv.config({ path: './.env' })

const app = express()
app.use(cors())
app.use(express.json())

connectToDatabase()

const port = process.env.PORT || 3000

app.listen(port, () => {
    logger.info(`Server running on port ${port}`)
})