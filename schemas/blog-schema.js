const mongoose = require('mongoose')

const blog_schema = new mongoose.Schema({
    header: {
        type: String, 
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    }
})

const blog_model = new mongoose.model('blog', blog_schema)

module.exports = blog_model