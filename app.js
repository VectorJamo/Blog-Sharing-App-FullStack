const express = require('express')
const mongoose = require('mongoose')
const register_model = require('./schemas/register-schema')
const fs = require('fs')

const app = express()

// Read the database URL from the file
fs.readFile('private/dbURI.txt', { encoding: 'utf8' }, (error, data) => {
    const dbURI = data
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
})

// Set up our view engine
app.set('view engine', 'ejs')

// Send some static files to the server initially
app.use(express.static('public'))

// Allow us to retrieve data from POST requests
app.use(express.urlencoded( { extended: true }))

// Handle GET requests from client
app.get('/', (req, res) => {
    res.redirect('login')
})
app.get('/login', (req, res) => {
    res.render('login', {title: 'Login Page', style: '/login-style.css'})
})
app.get('/register', (req, res) => {
    res.render('register', {title: 'Register an account', style: '/reg-style.css'})
})

// Handle POST requests
app.post('/register', (req, res) => {
    // Save the incoming data from the form to the database
    const document = new register_model(req.body)
    document.save()
        .then(result => {
            console.log('Data saved to the database collection')
            res.redirect('login')
        }) 
        .catch(error => {
            console.log(error)
        })
})
app.post('/login', (req, res) => {
    // Validate login information from the database
    const login_information = req.body
    console.log(`Username: ${login_information.username}`)
    console.log(`Password: ${login_information.password}`)

    register_model.find({ username: login_information.username, password: login_information.password })
        .then(result => {
            if(result.length == 0){
                console.log('Authentication unsuccessful.')
                res.send('Authentication unsuccessful.')
            }else{
                res.render('homepage', {title: 'Homepage', style: '/homepage-style.css'})
            }
        })
        .catch(error => {
            console.log(error)
        })
})
