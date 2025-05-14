const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    image: {type: String},
    edited: {type: Boolean},
    author: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    editors: [{type: mongoose.Types.ObjectId, ref: 'User', required: true}],
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag', required: true}]
},{timestamps:true})

const Post = mongoose.model('Post',postSchema)

module.exports = Post