const express = require('express')
const cors = require('cors')

const app = express()

app.options(
    '*',
    cors({
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    })
)

app.use(cors());

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.get('/', (req, res) => {
    res.json({ message: 'Hello World'})
})

module.exports = app