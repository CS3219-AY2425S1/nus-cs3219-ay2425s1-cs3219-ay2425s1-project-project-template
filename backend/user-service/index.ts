import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectToDatabase } from './db'

dotenv.config({ path: './.env' })

const app = express()
app.use(express.json())

const port: string | undefined = process.env.PORT

connectToDatabase()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
