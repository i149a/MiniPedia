const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController.js')
const Post = require('../models/Post.js')
const Tag = require('../models/Tag.js')

// Create Post 
router.post('/', postController.createPost)

// Get All Posts 
router.get('/', postController.getAllPosts)

// Rendering new post page
router.get('/new', async (req, res) => {
  const tags = await Tag.find({}).select('title')
  res.render('./posts/new.ejs', { tags })
})

// Get Post By ID
router.get('/:id', postController.getPostById)

// Update Post By ID
router.put('/:id', postController.updatePostById)

// Delete Post By ID
router.delete('/:id', postController.deletePostById)

// Edit Post By ID
router.get('/:id/edit', async (req, res) => {
  const [post, tags] = await Promise.all([
    Post.findById(req.params.id),
    Tag.find({}).select('title')
  ])
  
  // Checks is the post can be edited or not
  if (!post.editable)
    return res.redirect('/posts')
    
  res.render('./posts/edit.ejs', { 
    post,
    tags
  })
})

module.exports = router