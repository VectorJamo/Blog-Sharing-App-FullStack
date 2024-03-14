const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({

    fname: {
        type: String, 
        required: [true, 'Please enter your first name']
    },
    lname: {
        type: String,
        required: [true, 'Please enter your last name']
    },
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: [true, 'Username already in use'],
        minLength: [5, 'Username cannot be less than 5 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: [true, 'Email address already in use'],
        // TODO: add email validation
        validate: {
            validator: (email) => isEmail(email),
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: [5, 'Password should be more than 5 characters']
    }
})

// Mongoose hooks

// Hash the password
// Its always correct to hash the password in the pre('save') hook. Because this hook runs after the validation is completed and before the document is saved
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    
    next()
})

const userModel = mongoose.model('client', userSchema)
module.exports = userModel