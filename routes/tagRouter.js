const express = require('express') // Import Express
const router = express.Router() // Set up the router object 
const tagController = require('../controllers/tagController.js') // Import tag controller
const Tag = require('../models/Tag.js') // Import tag router

// POST method for creating a post for specific user (router, imported controller.function)
router.post('/', tagController.createTag)

// GET method for getting all tags (router, imported controller.function)
router.get('/', tagController.getAllTags)

// Rendering new tag tag
router.get('/new', (req, res) => {
  res.render('./tags/new.ejs')
})

// GET method for getting a tag by ID (router, imported controller.function)
router.get('/:id', tagController.getTagById)

// PUT method for updating a specific tag (router, imported controller.function)
router.put('/:id', tagController.updateTagById)

// DELETE method for deleting a specific tag (router, imported controller.function)
router.delete('/:id', tagController.deleteTagById)

// Rendering edit tag page
router.get('/:id/edit', async (req, res) => {
    const tag = await Tag.findById(req.params.id)
    res.render('./tags/edit.ejs', { tag })
})

// Export the router
module.exports = router