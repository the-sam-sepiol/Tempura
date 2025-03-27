const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // consolidated user model

router.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    
    //validate display name
    if (displayName.length < 3 || displayName.length > 20) {
      return res.status(400).json({ error: 'Display name must be between 3 and 20 characters' });
    }
    if (displayName.includes(' ')) {
      return res.status(400).json({ error: 'Display name cannot contain spaces' });
    }

    //validate password
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' });
    }

    //validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    //check for duplicate email and display name within the User collection
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ error: 'Email already registered' });
    
    const displayNameExists = await User.findOne({ displayName });
    if (displayNameExists) return res.status(400).json({ error: 'Display name already taken' });
    
    //create new user
    const newUser = new User({ email, password, displayName });
    await newUser.save();

    //generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      token,
      user: {
        email,
        displayName
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        //find user by email
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        //check if password is correct
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        //generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        res.json({
        success: true,
        token,
        user: {
            email: user.email,
            displayName: user.displayName,
            avatar: user.avatar
        }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

module.exports = router;