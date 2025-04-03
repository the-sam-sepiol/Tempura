const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path as needed
const protect = require('../middleware/auth');

// Update avatar endpoint
router.put('/avatar', protect, async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,        // assuming your protect middleware attaches user info
      { avatar },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating avatar', error);
    res.status(500).json({ error: 'Server error updating avatar' });
  }
});

router.put('/watchlist', protect, async (req, res) => {
    try {
      const { malId } = req.body;
      if (!malId) {
        return res.status(400).json({ error: 'malId is required' });
      }
      // Find the user by id attached by the protect middleware
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Add malId only if not already in the watchList array
      if (!user.watchList.includes(malId)) {
        user.watchList.push(malId);
        await user.save();
      }
      res.json({ success: true, user });
    } catch (error) {
      console.error('Error adding to watch list', error);
      res.status(500).json({ error: 'Server error adding to watch list' });
    }
});

module.exports = router;