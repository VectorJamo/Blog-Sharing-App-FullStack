const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Enter a blog title']
    },
    body: {
        type: String, 
        required: [true, 'Enter a blog body']
    },
    user: {
        type: String,
        required: true
    }
})

const blogModel = mongoose.model('blog', blogSchema)

module.exports = blogModel