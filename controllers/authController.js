const bcrypt = require('bcrypt') // Import Bcrypt for hashing passwords and comparing them
const User = require('../models/User.js') // Accessing user model since we will create a new user "sign-up"

// Register User function (sign-up)
const registerUser = async (req, res) => {
    try {
        // To make sure that the user is new "check by email"
        const userInDatabase = await User.findOne({ email: req.body.email })
        if (userInDatabase) {
            return res.send('Username already taken!')
        }

        // To compare the entered password with confirm password field
        if (req.body.password !== req.body.confirmPassword) {
            return res.send('Password and Confirm Password must match')
        }

        // Hashing the new password with 12 levels of complexity 
        const hashedPassword = bcrypt.hashSync(req.body.password, 12)

        // Create a new user 
        const user = await User.create({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username,
            picture: req.body.picture,
            isAdmin: req.body.isAdmin,
            posts: [],
            tags: []
        })

        // Sending a respnse to verify that the user is created
        res.render('./auth/thanks.ejs', { user })
    } catch (error) {
        console.error('An error has occurred registering a user!', error.message) // To handle the errors
    }
}

// Sign in function (sign-in)
const signInUser = async (req, res) => {
    try {
        // Check if the user exists in the DB
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.send('No user has been registered with that email. Please sign up!')
        }

        // Compare the user's password with bcrypt
        const validPassword = bcrypt.compareSync(
            req.body.password,
            user.password
        )
        if (!validPassword) {
            return res.send('Incorrect password! Please try again.')
        }

        // Create session object
        req.session.user = {
            email: user.email,
            _id: user._id
        }

        // Sending a respnse to verify that the user is signed
        res.redirect(`/users/${user._id}`)
    } catch (error) {
        console.error('An error has occurred signing in a user!', error.message) // To handle the errors
    }
}

// Sign out function (sign-out)
const signOutUser = (req, res) => {
    try {
        req.session.destroy() // Destroy the session
        res.redirect('/') // Redirect the user to another page 
    } catch (error) {
        console.error('An error has occurred signing out a user!', error.message) // To handle the errors
    }
}

// Update Password function
const updatePassword = async (req, res) => {
    try {
        // Check if the user exists in the DB
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.send('No user with that ID exists!')
        }

        // Check for the new password if they are exact the same 
        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.send('Password and Confirm Password must match')
        }

        // Hashing the new password with 12 levels of complexity 
        const hashedPassword = bcrypt.hashSync(req.body.newPassword, 12)

        // Updating the user 
        user.password = hashedPassword
        await user.save()

        // Sending a response
        res.render('./auth/confirm.ejs', { user })
    } catch (error) {
        console.error("An error has occurred updating a user's password!", error.message) // To handle the errors
    }
}

// To export All functions that are made
module.exports = {
    registerUser,
    signInUser,
    signOutUser,
    updatePassword
}