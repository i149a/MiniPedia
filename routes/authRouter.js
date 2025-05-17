const express = require('express') // Import Express
const router = express.Router() // Set up the router object 
const authController = require('../controllers/authController.js') // Import Auth Controllers

// POST method for creating new user "sign-up" (router, imported controller.function)
router.post('/sign-up', authController.registerUser)

// Post method for signing in "sign-in" (router, imported controller.function)
router.post('/sign-in', authController.signInUser)

// GET method for signing out "sign-out" (router, imported controller.function)
router.get('/sign-out', authController.signOutUser)

// PUT method for updating a specific user (router, imported controller.function)
router.put('/:id', authController.updatePassword)

// Rendering Sign up page 
router.get('/sign-up', (req, res) => {
    res.render('./auth/sign-up.ejs')
})

// Rendering Sign in page
router.get('/sign-in', (req, res) => {
    res.render('./auth/sign-in.ejs')
})

// Rendering Update password page
router.get('/:id/update-password', (req, res) => {
  res.render('./auth/update-password.ejs')
})

// Export the router
module.exports = router