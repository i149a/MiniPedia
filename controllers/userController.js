const User = require('../models/User.js') // Accessing user model
const Post = require('../models/Post.js') // Accessing user model
const authController = require('../controllers/authController.js')//mainly to access the session

// Get User by ID function
const getUserById = async (req, res) => {
    try {
        // Extract the user's ID from the URL params
        const user = await User.findById(req.params.id)
        .populate('posts','title body')
        .populate('tags', 'title')

        const sessionemail = req.session.user
        
    
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
        res.render('./users/profile.ejs', { user,data,sessionemail })
    } catch (error) {
        console.error('An error has occurred finding a user!test2', error.message) // To handle the errors
    }
}



const getAllUsers = async (req,res) => {

     const users = await User.find({})
        .populate('posts','title body')
        .populate('tags', 'title')

        
    
        // Returns the full user object, including their hashed password. Never send this to anyone other than the user it belongs to.

        // Create new object with data that wanted to be sent through the page
        const data = {
            username: users.username,
            picture: users.picture,
            isAdmin: users.isAdmin,
            posts: users.posts,
            tags: users.tags
        }

        // Send back a response 
        res.render('../views/users/all', { users,data })






}

// To export All functions that are made
module.exports = {
  getUserById,
  getAllUsers
}