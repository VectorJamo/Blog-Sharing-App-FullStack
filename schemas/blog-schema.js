const mongoose = require('mongoose')

const blog_schema = new mongoose.Schema({
    header: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
})

const blog_model = mongoose.model('blog', blog_schema)

module.exports = blog_model