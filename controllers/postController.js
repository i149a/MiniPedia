const User = require('../models/User.js')  // Accessing User model
const Post = require('../models/Post.js')  // Accessing Post model

// Creating new post function 
const createPost = async (req, res) => {
    try {
        // Find the user that is associated with this post
        const user = await User.findById(req.body.author) // author is who created the post

        // Create the post
        const post = await Post.create(req.body)

        // Update our user in the database by adding our new post's ObjectID to their array    
        user.posts.push(post._id)
        user.save()

        // Sending a respnse to verify that the flower is created
        res.redirect(`/posts/${post._id}`)
    } catch (error) {
        console.error('An error has occurred creating a post!', error.message) // To handle the errors
    }
}

// Get all posts function
const getAllPosts = async (req, res) => {
    try {
        // Query for posts collection 
        const posts = await Post.find({})

        // Sending a respnse to verify
        res.render('./posts/all.ejs', { posts })
    } catch (error) {
        console.error('An error has occurred getting all posts!', error.message) // To handle the errors
    }
}

// Get a post by ID function
const getPostById = async (req, res) => {
    try {
        // Query for a specific post ID
        const post = await Post.findById(req.params.id)

        // Sending a respnse to verify
        res.render('./posts/show.ejs', { post })
    } catch (error) {
        console.error('An error has occurred getting a post!', error.message) // To handle the errors
    }
}

// Uodate a specific post by ID
const updatePostById = async (req, res) => {
    try {
        // Find and Update the post using the id from the params
        // Passing the updated fields
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true }) // { new: true } ensures that the updated record is what is returned

        // Sending a respnse to verify
        res.redirect(`/posts/${post._id}`)
    } catch (error) {
        console.error('An error has occurred updating a post!', error.message) // To handle the errors
    }
}

// Delete post by ID
const deletePostById = async (req, res) => {
    try {
        // Find and Delete the post using the id from the params
        await Post.findByIdAndDelete(req.params.id) // No need to store this in a variable since it's being deleted

        // Sending a respnse to verify 
        res.render('./posts/confirm.ejs')
    } catch (error) {
        console.error('An error has occurred deleting a post!', error.message) // To handle the errors
    }
}

// To export All functions that are made
module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById
}