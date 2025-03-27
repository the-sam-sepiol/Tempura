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

module.exports = router;