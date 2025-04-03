const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activityType: {
        type: String,
        enum: [
            'ADDED_TO_WATCHED',    // Only show completed shows
            'POSTED_REVIEW',       // Show when they review
            'UPDATED_TOP_THREE',   // Show top three changes
            'NEW_FOLLOWER'         // Show when someone follows you
        ],
        required: true
    },
    animeId: {
        type: Number,
        required: true
    },
    details: {
        oldTopThree: [{
            animeId: Number,
            position: Number
        }],
        newTopThree: [{
            animeId: Number,
            position: Number
        }],
        rating: Number,
        reviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        },
        followerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);