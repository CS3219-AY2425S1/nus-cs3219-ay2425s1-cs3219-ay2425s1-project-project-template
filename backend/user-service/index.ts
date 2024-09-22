import cors from "cors"
import express from "express"

const app = express()

const port: number = 5000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})