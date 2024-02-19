const express = require('express')
const mongoose = require('mongoose')
const blog_model = require('./schemas/blog-schema')

const app = express()

const dbURI = 'mongodb+srv://suraj_neupane:surajdatabase@node-database.ziayke1.mongodb.net/node-database'

// Connect to the database
mongoose.connect(dbURI)
    .then(result => {
        // If connection was made, start the server
        app.listen(3000, () => {
            console.log('Server is now listening for requests on Port 3000.')
        })                
    })
    .catch(error => {
        console.log(error)
    })

// Set up our view engine
app.set('view engine', 'ejs')

// Send some static files to the server initially
app.use(express.static('public'))

// User defined middlewear functions
app.use((req, res, next) => {
    // Display all the data currently in the database collection
    blog_model.find({})
        .then(result => {
            console.log(result)
        })
        .catch(error => {
            console.log(error)
        })
    next()
})

// Handle GET requests from client
app.get('/', (req, res) => {
    res.redirect('login')
})
app.get('/login', (req, res) => {
    res.render('login', {title: 'Login Page', style: '/login-reg-style.css'})
})
app.get('/register', (req, res) => {
    res.render('register', {title: 'Register an account', style: '/login-reg-style.css'})
})
app.get('/homepage', (req, res) => {
    res.render('homepage', {title: 'Homepage', style: '/homepage-style.css'})


    // Send a document to the database collection
    const data = {header: 'Hello World.', body:'Hello to the whole world!'};

    blog_model.create(data)
        .then(result => {
            console.log('Data saved to the database!')
        })
})