const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config();
const connectDB = require('./config/db')
const questionsRouter = require('./routes/questionsRoutes')
const usersRouter = require('./routes/usersRoutes')

connectDB();

const app = express()

app.options(
    '*',
    cors({
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    })
)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

// /api/users/login
// /api/users/signup
app.use('/api/users', usersRouter);

// /api/questions/signup
app.use('/api/questions', questionsRouter);

module.exports = app