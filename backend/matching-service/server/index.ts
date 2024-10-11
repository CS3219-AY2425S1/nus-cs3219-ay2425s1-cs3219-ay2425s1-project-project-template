import cors from "cors"
import dotenv from "dotenv"
import express, { Request, Response } from "express"
import { sendMatchingRequest } from "../producer/producer"
import { completeMatchRequest } from "../consumer/consumer"
import logger from "../utils/logger"

dotenv.config({ path: './.env' })

const app = express()
app.use(express.json())
app.use(cors())

app.post('/match', async (req: Request, res: Response) => {
    const { name, difficulty, categories } = req.body
    logger.info(`User ${name} has requested for a match with difficulty ${difficulty} and categories ${categories}`)
    
    const data = { name, difficulty, categories }
    await sendMatchingRequest(data)
    res.status(200).json({ message: 'Match request sent successfully' })
})

const port = process.env.PORT

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`)
})