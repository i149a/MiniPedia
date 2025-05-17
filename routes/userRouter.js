const express = require('express') // Import Express
const router = express.Router() // Set up the router object 
const userController = require('../controllers/userController.js') // Import user controller

// GET method for getting user by ID (router, imported controller.function)
router.get('/:id', userController.getUserById)

// Export the router
module.exports = router