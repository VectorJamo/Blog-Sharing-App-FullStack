const express = require('express')

const app = express()

// Set up our view engine
app.set('view engine', 'ejs')

// Send some static files to the server initially
app.use(express.static('public'))

app.listen(3000, () => {
    console.log('Server is now listening for requests on Port 3000.')
})

app.get('/', (req, res) => {
    res.render('index', {title: 'Homepage'})
})