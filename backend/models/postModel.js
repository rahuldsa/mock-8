const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    name: String,
    description: String,
    category: String,
    image: String,
    location: String,
    postedAt: Date,
    price: Number,
})

const postModel = mongoose.model('post', postSchema)

module.exports = { postModel }