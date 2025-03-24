const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
    user1Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure unique friendships
FriendshipSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true });

module.exports = mongoose.model('Friendship', FriendshipSchema);