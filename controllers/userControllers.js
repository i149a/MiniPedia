const User = require('../models/User.js') // Accessing user model

// Get User by ID function
const getUserById = async (req, res) => {
    try {
        // Extract the user's ID from the URL params
        const user = await User.findById(req.params.id)
            // Returns the full user object, including their hashed password. Never send this to anyone other than the user it belongs to.

        // Create new object with data that wanted to be sent through the page
        const data = {
            username: user.username,
            picture: user.picture,
            isAdmin: user.isAdmin,
            posts: user.posts,
            tags: user.tags
        }

        // Send back a response 
        res.render('./users/profile.ejs', { user })
    } catch (error) {
        console.error('An error has occurred finding a user!', error.message) // To handle the errors
    }
}

// To export All functions that are made
module.exports = {
  getUserById
}