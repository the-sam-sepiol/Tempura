const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Review = require('../models/Review');
const ActivityLog = require('../models/ActivityLog');
const protect = require('../middleware/auth');
const { getAnimeDetails } = require('../utils/animeUtils');

// @desc    Follow a user
// @route   POST /api/friends/follow/:userId
// @access  Private
router.post('/follow/:userId', protect, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already following
    if (currentUser.following.includes(userToFollow._id.toString())) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Add to following list
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { following: userToFollow._id.toString() } }
    );

    // Add to followers list of the user being followed
    await User.findByIdAndUpdate(
      req.params.userId,
      { $push: { followers: currentUser._id.toString() } }
    );

    // Create activity for the user being followed (they got a new follower)
    // We'll use a placeholder animeId (0) since this is a follower notification
    // The ActivityLog schema requires an animeId
    await ActivityLog.create({
      userId: userToFollow._id,
      activityType: 'NEW_FOLLOWER', // You'll need to add this to your enum in the schema
      animeId: 0, // Placeholder (required by schema)
      details: {
        followerId: currentUser._id // Store the follower's ID
      }
    });

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Unfollow a user
// @route   POST /api/friends/unfollow/:userId
// @access  Private
router.post('/unfollow/:userId', protect, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if actually following
    if (!currentUser.following.includes(userToUnfollow._id.toString())) {
      return res.status(400).json({ error: 'Not following this user' });
    }

    // Remove from following list
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { following: userToUnfollow._id.toString() } }
    );

    // Remove from followers list of the user being unfollowed
    await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { followers: currentUser._id.toString() } }
    );

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Get following list (users you follow)
// @route   GET /api/friends/following
// @access  Private
router.get('/following', protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    const following = await User.find({
      _id: { $in: currentUser.following }
    }).select('displayName avatar');

    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Get followers list
// @route   GET /api/friends/followers
// @access  Private
router.get('/followers', protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    const followers = await User.find({
      _id: { $in: currentUser.followers }
    }).select('displayName avatar');

    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Search for users by display name
// @route   GET /api/friends/search/:query
// @access  Private
router.get('/search/:query', protect, async (req, res) => {
  try {
    const { query } = req.params;
    
    // Search for users whose display names match the query
    const users = await User.find({
      displayName: { $regex: query, $options: 'i' },
      _id: { $ne: req.user.id } // Exclude current user
    }).select('displayName avatar');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Get friend card data (full profile with takes and watchlist)
// @route   GET /api/friends/:userId
// @access  Private
router.get('/:userId', protect, async (req, res) => {
  try {
    // Get user with selected fields
    const user = await User.findById(req.params.userId)
      .select('displayName avatar topThree completedList');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's reviews
    const reviews = await Review.find({ userId: req.params.userId });
    
    // Format reviews/takes
    const takes = await Promise.all(reviews.map(async (review) => {
      try {
        // Get anime details from MAL API or database
        const animeDetails = await getAnimeDetails(review.animeId);
        
        return {
          id: review._id,
          rating: review.rating,
          comment: review.content || "",
          movie: {
            image: animeDetails.image,
            title: animeDetails.title
          }
        };
      } catch (error) {
        console.error(`Error getting anime details for review ${review._id}:`, error);
        // Return placeholder data if anime details cannot be fetched
        return {
          id: review._id,
          rating: review.rating,
          comment: review.content || "",
          movie: {
            image: "/api/placeholder/50/70",
            title: `Anime ${review.animeId}`
          }
        };
      }
    }));

    // Format watched list items
    const watchedList = await Promise.all(user.completedList.map(async (animeId) => {
      try {
        // Get anime details from MAL API or database
        const animeDetails = await getAnimeDetails(animeId);
        
        // Check if this anime is in the user's top three
        const topThreeEntry = user.topThree.find(item => item.animeId === animeId);
        
        return {
          id: animeId,
          image: animeDetails.image,
          title: animeDetails.title,
          rank: topThreeEntry ? topThreeEntry.position : undefined
        };
      } catch (error) {
        console.error(`Error getting anime details for anime ${animeId}:`, error);
        // Return placeholder data if anime details cannot be fetched
        return {
          id: animeId,
          image: "/api/placeholder/100/150",
          title: `Anime ${animeId}`,
          rank: undefined
        };
      }
    }));

    // Prepare the friend object for FriendCard
    const friendData = {
      name: user.displayName,
      avatar: user.avatar,
      takes: takes,
      watchedList: watchedList
    };

    res.status(200).json(friendData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Get activity log (including new followers)
// @route   GET /api/friends/activity
// @access  Private
router.get('/activity', protect, async (req, res) => {
  try {
    // Get activities related to users you follow or your own activities
    const currentUser = await User.findById(req.user.id);
    
    // Get regular activities from users you follow + your new follower notifications
    const activities = await ActivityLog.find({
      $or: [
        { 
          userId: { $in: currentUser.following },
          activityType: { $in: ['ADDED_TO_WATCHED', 'POSTED_REVIEW', 'UPDATED_TOP_THREE'] }
        },
        { 
          userId: req.user.id, 
          activityType: 'NEW_FOLLOWER' // Your new follower notifications
        }
      ]
    })
    .sort({ createdAt: -1 }) // Sort by newest first
    .limit(20) // Limit to most recent 20 activities
    .populate('userId', 'displayName avatar');

    // For follower activities, we need to populate the follower details
    const enhancedActivities = await Promise.all(activities.map(async (activity) => {
      const activityObj = activity.toObject();
      
      if (activity.activityType === 'NEW_FOLLOWER' && activity.details && activity.details.followerId) {
        const follower = await User.findById(activity.details.followerId).select('displayName avatar');
        if (follower) {
          activityObj.follower = follower;
        }
      }
      
      return activityObj;
    }));

    res.status(200).json(enhancedActivities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;