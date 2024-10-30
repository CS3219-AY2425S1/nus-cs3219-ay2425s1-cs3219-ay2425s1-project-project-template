import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { router as executeCodeRoute } from "../routes/executeCodeRoute"

dotenv.config({ path: './.env' })

const app = express()
app.use(cors())
app.use(express.json())
app.use(executeCodeRoute)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})