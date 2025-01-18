// Required dependencies
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
    try {
        const { email, password, displayName } = req.body;

        // Validate display name
        if (displayName.length < 3 || displayName.length > 20) {
            return res.status(400).json({ 
                error: 'Display name must be between 3 and 20 characters' 
            });
        }

        // Check for spaces in display name
        if (displayName.includes(' ')) {
            return res.status(400).json({ 
                error: 'Display name cannot contain spaces' 
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({ 
                error: 'Password must be at least 8 characters long' 
            });
        }

        // Password complexity check
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Invalid email format' 
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new user
        const user = await User.create({
            email,
            password,  // Password will be hashed by User model pre-save hook
            displayName
        });

        // Create token for immediate login after signup
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// @route   GET /api/auth/verify
// @desc    Verify JWT token & get user data
// @access  Private
router.get('/verify', async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName
            }
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;