const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    author: {type: mongoose.Types.ObjectId, ref: 'User'},
    posts: [{type: mongoose.Types.ObjectId, ref: 'Post'}]
},{timestamps:true})

const Tag = mongoose.model('Tag',tagSchema)

module.exports = Tag