const express = require('express')
const fs = require('fs')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config();

const routes = require('./routes/routes')

const app = express()
app.use(cors({origin: 'http://localhost:5173', credentials: true}))
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.DB_URI)
.then(response => {
    console.log('Successfully connected to the database.')
    app.listen(3000, () => {
        console.log('Server is now listening to requests on port 3000.')
    })
})
.catch(error => {
    console.log(error)
})

// Routes

app.use(routes.router)








