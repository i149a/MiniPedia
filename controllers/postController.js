// Import required models
const User = require('../models/User.js')
const Post = require('../models/Post.js')
const Tag = require('../models/Tag.js')


// CREATE POST FUNCTION
const createPost = async (req, res) => {
    try {
        const { title, body, image, tags = [] } = req.body
        const author = req.body.author // Current user's ID (Who is writing the post)
        
        // Create new post
        const post = await Post.create({
            title,
            body,
            image, 
            author,
            tags
        })

        // Add post to author's posts array
        await User.findByIdAndUpdate(author, {
            $push: { posts: post._id } // $push adds to array
        })

        // Add post to all related tags
        await Tag.updateMany(
            { _id: { $in: tags } }, // Find all tags in the tags array
            { $push: { posts: post._id } } // Add post ID to each tag's posts array
        )

        // Redirect to the new post's page
        res.redirect(`/posts/${post._id}`)
    } catch (error) {
        console.error('Error creating post:', error.message)
        res.status(500).send('Error creating post')
    }
}

// GET ALL POSTS FUNCTION
const getAllPosts = async (req, res) => {
    try {
        // Find all posts and populate related data
        const posts = await Post.find({})
            .populate('author', 'username')
            .populate('tags', 'title')
            
        // Render view with posts and current user data
        res.render('./posts/all.ejs', { 
            posts,
            currentUser: req.user // Pass logged-in user data
        })
    } catch (error) {
        console.error('Error getting posts:', error.message)
        res.status(500).send('Error getting posts')
    }
}

// GET A POST BY ID FUNCTION
const getPostById = async (req, res) => {
    try {
        // Find post and populate all relationships
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate('editors', 'username')
            .populate('tags', 'title description')
            
        // Get all available tags for tag selection
        const allTags = await Tag.find({})
        
        // Render single post view with all data
        res.render('./posts/show.ejs', { 
            post,
            allTags,
            currentUser: req.user
        })
    } catch (error) {
        console.error('Error getting post:', error.message)
        res.status(500).send('Error getting post')
    }
}

// UPDATE POST BY ID FUNCTION 
const updatePostById = async (req, res) => {
    try {
        const { title, body, image, editor, tags = [] } = req.body
        
        // Get current post data for comparison
        const currentPost = await Post.findById(req.params.id)
        const currentTags = currentPost.tags.map(tag => tag.toString())
        
        // Determine which tags were added/removed
        const tagsToAdd = tags.filter(tag => !currentTags.includes(tag))
        const tagsToRemove = currentTags.filter(tag => !tags.includes(tag))
        
        // Update the post
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            {
                title,
                body,
                image,
                edited: true, // Mark as edited
                $addToSet: { editors: editor }, // Add editor if not already present
                tags // Set new tags array
            },
            { new: true } // Return the updated document
        )
        
        // Add post to new tags
        await Tag.updateMany(
            { _id: { $in: tagsToAdd } },
            { $addToSet: { posts: post._id } } // $addToSet prevents duplicates
        )
        
        // Remove post from removed tags
        await Tag.updateMany(
            { _id: { $in: tagsToRemove } },
            { $pull: { posts: post._id } } // $pull removes from array
        )
        
        // Redirect to updated post
        res.redirect(`/posts/${post._id}`)
    } catch (error) {
        console.error('Error updating post:', error.message)
        res.status(500).send('Error updating post')
    }
}

// DELETE POST BY ID FUNCTION
const deletePostById = async (req, res) => {
    try {
        // Find and delete the post
        const post = await Post.findByIdAndDelete(req.params.id)
        
        // Remove post from author's posts array
        await User.findByIdAndUpdate(post.author, {
            $pull: { posts: post._id } // Remove post ID
        })
        
        // Remove post from all related tags
        await Tag.updateMany(
            { posts: post._id },
            { $pull: { posts: post._id } }
        )
        
        // Render deletion confirmation page
        res.render('./posts/confirm.ejs', { 
            currentUser: req.user // Pass user data for header
        })
    } catch (error) {
        console.error('Error deleting post:', error.message)
        res.status(500).send('Error deleting post')
    }
}

// Export all functions
module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById
}