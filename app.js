const express = require('express')

const app = express()

app.listen(3000, () => {
    console.log('Server is now listening for requests on Port 3000.')
})

// Set up our view engine
app.set('view engine', 'ejs')

// Send some static files to the server initially
app.use(express.static('public'))

// Handle GET requests from client
app.get('/', (req, res) => {
    res.render('index', {title: 'Login Page'})
})