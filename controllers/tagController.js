const User = require('../models/User.js')  // Accessing User model
const Post = require('../models/Tag.js')  // Accessing Tag model

// Creating new tag function 
const createTag = async (req, res) => {
    try {
        // Find the user that is associated with this post
        const user = await User.findById(req.body.author) // author is who created the tag

        // Create the post
        const tag = await Post.create(req.body)

        // Update our user in the database by adding our new tag's ObjectID to their array    
        user.tags.push(tag._id)
        user.save()

        // Sending a respnse to verify that the flower is created
        res.redirect(`/tags/${tag._id}`)
    } catch (error) {
        console.error('An error has occurred creating a tag!', error.message) // To handle the errors
    }
}

// Get all tags function
const getAllTags = async (req, res) => {
    try {
        // Query for tags collection 
        const tags = await Tag.find({})

        // Sending a respnse to verify
        res.render('./tags/all.ejs', { tags })
    } catch (error) {
        console.error('An error has occurred getting all tags!', error.message) // To handle the errors
    }
}

// Get a tag by ID function
const getTagById = async (req, res) => {
    try {
        // Query for a specific tag ID
        const tag = await Post.findById(req.params.id)

        // Sending a respnse to verify
        res.render('./tags/show.ejs', { tag })
    } catch (error) {
        console.error('An error has occurred getting a tag!', error.message) // To handle the errors
    }
}

// Uodate a specific tag by ID
const updateTagById = async (req, res) => {
    try {
        // Find and Update the post using the id from the params
        // Passing the updated fields
        const tag = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true }) // { new: true } ensures that the updated record is what is returned

        // Sending a respnse to verify
        res.redirect(`/tags/${tag._id}`)
    } catch (error) {
        console.error('An error has occurred updating a tag!', error.message) // To handle the errors
    }
}

// Delete tag by ID
const deleteTagById = async (req, res) => {
    try {
        // Find and Delete the post using the id from the params
        await Tag.findByIdAndDelete(req.params.id) // No need to store this in a variable since it's being deleted

        // Sending a respnse to verify 
        res.render('./tags/confirm.ejs')
    } catch (error) {
        console.error('An error has occurred deleting a tag!', error.message) // To handle the errors
    }
}

// To export All functions that are made
module.exports = {
  createTag,
  getAllTags,
  getTagById,
  updateTagById,
  deleteTagById
}