const userModel = require('../schemas/UserSchema')
const blogModel = require('../schemas/BlogSchema')
const fs = require('fs')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


function checkAuthenticated(req) {
    // If, the user is authenticated, it will return the name of the authenticated user, if not, it will return null
    // Validate the cookie
    return new Promise((resolve, reject) => {
        const token = req.cookies.jwt
        if(!token){
            resolve(null)
        }else{
            // Validate the cookie
            // First, load the secret string
            fs.readFile('./secrets/jwt-string.txt', 'utf-8', (err, data) => {
                if(err){
                    console.log(err)
                    reject('Cannot load secret string')
                }
                jwt.verify(token, data, (err, decodedToken) => {
                    if(err){
                        // Token is invalid
                        console.log(err.message)
                        resolve(null)
                    }else{
                        // Get the user's name from the decoded ID
                        userModel.findById(decodedToken.id)
                            .then(document => {
                                resolve(document.username)
                            })
                            .catch(error => {
                                console.log(error)
                                resolve(null)
                            })
                    }
                })
            })
        }

    })
}
async function homepage_get(req, res) {
    const username = await checkAuthenticated(req)
    res.status(200).json({username})


}
async function login_get(req, res) {
    const responseObject = {isAuthenticated: false}
    // TODO: Handle login
    // First, check if user has a valid cookie
    const username = await checkAuthenticated(req)
    if(username != null){
        responseObject.isAuthenticated = true
        res.json(responseObject)
    }else{
        // If user is not authenticated
        res.json(responseObject)        
    }
    
}
function login_post(req, res) {
    
    // Get the username and password
    // Compare the passwords
    // If authenticated, send JWT
    // Else, send 'Username and password' do not match
    const username = req.body.username
    const password = req.body.password
    const responseObject = {success: false}

    userModel.findOne({username: username})
    .then(document => {
        console.log(document)
        // Compare the passwords
        bcrypt.compare(password, document.password, (err, result) => {
            if(result == true){
                // Send a JWT cookie
                const id = document._id
                fs.readFile('./secrets/jwt-string.txt', 'utf-8', (err, data) => {
                    if(err){
                        return;
                    }
                    const token = jwt.sign({id}, data)
    
                    res.cookie('jwt', token)
                    responseObject.success = true
                    res.status(200).json(responseObject)
                })
            }else{
                console.log('NOT MATCH')
                res.status(200).json(responseObject)
            }
        })
    })
    .catch(error => {
        console.log(error)
        console.log('USERNAME NOT FOUND')
        res.status(200).json(responseObject)
})
}

async function register_get(req, res){
    const responseObject = {isAuthenticated: false}
    // TODO: Handle login
    // First, check if user has a valid cookie
    const username = await checkAuthenticated(req)
    if(username != null){
        responseObject.isAuthenticated = true
        res.json(responseObject)
    }else{
        // If user is not authenticated
        res.json(responseObject)        
    }


}
async function register_post(req, res) {
    const errorObject = {fname: '', lname: '', username: '', email: '', password: ''}

    // Validate the data
     try {
        const document = await userModel.create(req.body)
        console.log(document)
        console.log('Document saved to the database!')

        //Create and send a JWT cookie
        fs.readFile('./secrets/jwt-string.txt', 'utf-8', (err, data) => {
            const id = document._id
            const token = jwt.sign({id}, data)
            console.log(token)
            
            res.cookie('jwt', token, { 
                httpOnly: false, // Cookie accessible only by the server
                sameSite: 'None', // Allow cookies to be sent in cross-origin requests
                
            });        
            res.status(200).send('SUCCESS')
        })

    }catch(error){
        // First, handle any duplicate fields error
        if(error.code == 11000){
            const errorField = Object.keys(error.keyValue)[0]
            errorObject[errorField] = `${errorField} already in use.`
        }
        // Then, handle other errors
        for(const field in error.errors){
            const errorField = error.errors[field].properties.path
            const errorMessage = error.errors[field].properties.message
            errorObject[errorField] = errorMessage
        }
        console.log(errorObject)
        res.status(400).json(errorObject)
    }

}

function logout_get(req, res) {
    const token = req.cookies.jwt
    
    res.cookie('jwt', '', {maxAge: 1})
    res.status(200).send('SUCCESS')
}

async function blogs_get(req, res) {
    const username = await checkAuthenticated(req)
    res.status(200).json({username})
}

async function allblogs_get(req, res) {
     try {
        const allBlogs = await blogModel.find({})        
        res.json(allBlogs)
    }catch(err){
        console.log(err)
    } 
}

async function create_blog_post(req, res) {
    const errorObject = {containsError: true, title: '', body: ''}
    // Validate the blog
    try {
        const document = await blogModel.create(req.body)
        console.log('Blog document created!')
        console.log(document)

        errorObject.containsError = false
        res.status(200).json(errorObject)

    }catch(error){
        for(const field in error.errors){
            const errorField = error.errors[field].properties.path
            const errorMessage = error.errors[field].properties.message
            errorObject[errorField] = errorMessage
        }
        res.status(200).json(errorObject)
    }

}

async function delete_post(req, res) {
    try {
        const result = await blogModel.deleteOne(req.body)
        res.status(200).send('SUCCESS')
    }catch(err){
        console.log(error)
        res.status(400).send('FAILURE')
    }
}

module.exports = {homepage_get, login_get, login_post, register_get, register_post, logout_get, blogs_get, allblogs_get, create_blog_post, delete_post}