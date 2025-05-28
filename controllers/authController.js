const bcrypt = require('bcrypt');
const User = require('../models/User.js');

// Password validation function
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
};

// Registeration Function
const registerUser = async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ email: req.body.email });
        if (userInDatabase) {
            return res.status(400).render('auth/sign-up', { 
                error: 'Email already registered!' 
            });
        }

        if (!validatePassword(req.body.password)) {
            return res.status(400).render('auth/sign-up', {
                error: 'Password must be 8+ chars with uppercase, lowercase, and number'
            });
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).render('auth/sign-up', {
                error: 'Passwords do not match'
            });
        }
        let defaultP=req.body.picture
        if (!defaultP){
            defaultP="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_items_boosted&w=740"

            
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 12);

        const user = await User.create({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username,
            picture: defaultP,
            isAdmin: false,
            posts: [],
            tags: []
        });

        req.session.user = {
            email: user.email,
            _id: user._id
        };

        res.redirect(`/users/${user._id}`);
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).render('auth/sign-up', {
            error: 'Registration failed. Please try again.'
        });
    }
};

// Sign in Function
const signInUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).render('auth/sign-in', {
                error: 'No user found with that email'
            });
        }

        const validPassword = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            return res.status(400).render('auth/sign-in', {
                error: 'Incorrect password'
            });
        }

        req.session.user = {
            email: user.email,
            _id: user._id
        };

        res.redirect(`/users/${user._id}`);
    } catch (error) {
        console.error('Sign in error:', error.message);
        res.status(500).render('auth/sign-in', {
            error: 'Sign in failed. Please try again.'
        });
    }
};

// Sign Out Function
const signOutUser = (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.error('Sign out error:', error.message);
        res.status(500).send('Sign out failed');
    }
};

// Update Password Function
const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('auth/update-password', {
                error: 'User not found',
                user: null
            });
        }

        const validPassword = bcrypt.compareSync(
            req.body.oldPassword,
            user.password
        );
        if (!validPassword) {
            return res.status(400).render('auth/update-password', {
                error: 'Current password is incorrect',
                user: user
            });
        }

        if (!validatePassword(req.body.newPassword)) {
            return res.status(400).render('auth/update-password', {
                error: 'Password must be 8+ chars with uppercase, lowercase, and number',
                user: user
            });
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.status(400).render('auth/update-password', {
                error: 'New passwords do not match',
                user: user
            });
        }

        const hashedPassword = bcrypt.hashSync(req.body.newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        if (req.session.user && req.session.user._id.toString() === user._id.toString()) {
            req.session.user = {
                email: user.email,
                _id: user._id
            };
        }

        res.redirect(`/users/${user._id}`);
    } catch (error) {
        console.error("Password update error:", error.message);
        res.status(500).render('auth/update-password', {
            error: 'Password update failed. Please try again.',
            user: null
        });
    }
};

// Rendering Update Picture Page
const renderUpdatePicturePage = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('error', { 
                message: 'User not found',
                error: { status: 404 }
            });
        }
        res.render('auth/update-picture', { 
            user,
            title: 'Update Profile Picture',
            error: null
        });
    } catch (error) {
        console.error('Render picture update error:', error.message);
        res.status(500).render('error', { 
            message: 'Server Error',
            error: { status: 500 }
        });
    }
};

// Update Picture Function
const updatePicture = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('error', { 
                message: 'User not found',
                error: { status: 404 }
            });
        }

        if (!req.body.picture) {
            return res.status(400).render('auth/update-picture', {
                user,
                error: 'Picture URL is required'
            });
        }

        user.picture = req.body.picture;
        await user.save();

        res.redirect(`/users/${user._id}`);
    } catch (error) {
        console.error('Picture update error:', error.message);
        res.status(500).render('auth/update-picture', {
            user: null,
            error: 'Failed to update picture. Please try again.'
        });
    }
};

// Forget Password Function
const forgetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).render('auth/reset-password', {
                error: 'No user found with that email',
                email
            });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).render('auth/reset-password', {
                error: 'Password must be 8+ chars with uppercase, lowercase, and number',
                email
            });
        }  

        if (newPassword !== confirmPassword) {
            return res.status(400).render('auth/reset-password', {
                error: 'Passwords do not match',
                email
            });
        }

        const isSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isSameAsOld) {
            return res.status(400).render('auth/reset-password', {
                error: 'New password must be different from the old password',
                email
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        res.redirect('/');
    } catch (error) {
        console.error('Password reset error:', error.message);
        res.status(500).render('auth/reset-password', {
            error: 'Failed to reset password. Please try again.',
            email: req.body.email
        });
    }
};

module.exports = {
    registerUser,
    signInUser,
    signOutUser,
    updatePassword,
    renderUpdatePicturePage,
    updatePicture,
    forgetPassword
};
