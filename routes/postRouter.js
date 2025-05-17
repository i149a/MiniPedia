const express = require('express') // Import Express
const router = express.Router() // Set up the router object 
const postController = require('../controllers/postController.js') // Import post controller
const Post = require('../models/Post.js') // Import post router

// POST method for creating a post for specific user (router, imported controller.function)
router.post('/', postController.createPost)

// GET method for getting all posts (router, imported controller.function)
router.get('/', postController.getAllPost)

// Rendering new post page
router.get('/new', (req, res) => {
  res.render('./posts/new.ejs')
})

// GET method for getting a post by ID (router, imported controller.function)
router.get('/:id', postController.getPostById)

// PUT method for updating a specific post (router, imported controller.function)
router.put('/:id', postController.updatePostById)

// DELETE method for deleting a specific post (router, imported controller.function)
router.delete('/:id', postController.deletePostById)

// Rendering edit post page
router.get('/:id/edit', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('./posts/edit.ejs', { post })
})

// Export the router
module.exports = router