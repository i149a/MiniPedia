const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const User = require('../models/User.js');

// POST routes
router.post('/sign-up', authController.registerUser);
router.post('/sign-in', authController.signInUser);
router.get('/sign-out', authController.signOutUser);
router.post('/:id/update-password', authController.updatePassword);
router.post('/:id/update-picture', authController.updatePicture);

// GET Sign Up Route
router.get('/', (req, res) => {
    res.render('auth/sign-up');
});

// GET Sign In Route
router.get('/sign-in', (req, res) => {
    res.render('posts/all');
});

// Update Password Route
router.get('/:id/update-password', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('error', { 
                message: 'User not found', 
                error: { status: 404 } 
            });
        }
        res.render('auth/update-password', { user, error: null });
    } catch (error) {
        res.status(500).render('error', { 
            message: 'Server Error', 
            error: { status: 500 } 
        });
    }
});

// Update Picture Route
router.get('/:id/update-picture', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('error', { 
                message: 'User not found', 
                error: { status: 404 } 
            });
        }
        res.render('auth/update-picture', { user, error: null });
    } catch (error) {
        res.status(500).render('error', { 
            message: 'Server Error', 
            error: { status: 500 } 
        });
    }
});

// Forget Password Route
router.get('/forget-password', (req, res) => {
    res.render('auth/forget-password', {
        error: null,
        email: ''
    });
});
router.post('/forget-password', authController.forgetPassword);

module.exports = router;
