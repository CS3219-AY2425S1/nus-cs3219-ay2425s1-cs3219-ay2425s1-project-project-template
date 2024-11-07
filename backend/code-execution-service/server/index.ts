import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import logger from "../utils/logger"
import { connectToDatabase } from "./db"
import { router as executeCodeRoute } from "../execute-code/executeCodeRoute"
import { router as submitCodeRoute } from "../submit-code/submitCodeRoute"
import { router as getCodeRoute } from "../get-code/getCodeRoute"

dotenv.config({ path: './.env' })

const app = express()
app.use(cors())
app.use(express.json())
app.use(executeCodeRoute)
app.use(submitCodeRoute)
app.use(getCodeRoute)

connectToDatabase()

const port = process.env.PORT || 3000

app.listen(port, () => {
    logger.info(`Server running on port ${port}`)
})