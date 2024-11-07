import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import logger from "../utils/logger"
import { connectToDatabase } from "./db"
import { router as getMatchHistoryRoute } from "../get-match-history/getMatchHistoryRoute" 

dotenv.config({ path: './.env' })

const app = express()
app.use(cors())
app.use(express.json())

app.use(getMatchHistoryRoute)

const port = process.env.PORT || 3000

app.listen(port, () => {
    logger.info(`Server running on port ${port}`)
})