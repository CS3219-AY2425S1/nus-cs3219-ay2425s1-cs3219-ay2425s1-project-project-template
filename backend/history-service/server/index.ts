import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import logger from "../utils/logger"
import { router as getMatchHistoryRoute } from "../get-match-history/getMatchHistoryRoute" 
import { router as getSubmissionsRoute } from "../get-submissions/getSubmissionsRoute"
import { router as getUserRoute } from "../get-user/getUserRoute"
import { router as getMatchRoute } from "../get-match/getMatchRoute"

dotenv.config({ path: './.env' })

const app = express()
app.use(cors())
app.use(express.json())

app.use(getMatchHistoryRoute)
app.use(getSubmissionsRoute)
app.use(getUserRoute)
app.use(getMatchRoute)

const port = process.env.PORT || 3000

app.listen(port, () => {
    logger.info(`Server running on port ${port}`)
})