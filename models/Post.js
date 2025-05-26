const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    image: {type: String},
    editedText: {type: String},
    edited: {type: Boolean},
    author: {type: mongoose.Types.ObjectId, ref: 'User'},
    editors: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}]
},{timestamps:true})

const Post = mongoose.model('Post',postSchema)

module.exports = Post