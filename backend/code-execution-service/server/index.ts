import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { router as executeCodeRoute } from "../routes/executeCodeRoute"
import logger from "../utils/logger"

dotenv.config({ path: './.env' })

const app = express()
app.use(cors())
app.use(express.json())
app.use(executeCodeRoute)

const port = process.env.PORT || 3000

app.listen(port, () => {
    logger.info(`Server running on port ${port}`)
})