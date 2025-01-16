const mongoose = require('mongoose');

const RecommendationSectionSchema = new mongoose.Schema({
    sectionType: {
        type: String,
        enum: [
            'POPULAR_PICKS', 
            'BASED_ON_FAVORITE', 
            'SLEEPER_PICKS',
            'SEASONAL_PICKS',       // New section
            'STAFF_PICKS'          // New section
        ],
        required: true
    },
    title: {
        type: String,
        required: true    // e.g., "Based off your love of Attack on Titan"
    },
    animeList: [{
        animeId: Number,
        weight: Number,   // For sorting/ranking
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    userId: {            // For personalized sections
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    order: {            // Order on homepage
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Index for quick lookups by user and type
RecommendationSectionSchema.index({ userId: 1, sectionType: 1 });

// Index for sorting by order
RecommendationSectionSchema.index({ order: 1 });

// Methods for managing recommendations
RecommendationSectionSchema.methods.updateAnimeList = async function(newAnimeList) {
    this.animeList = newAnimeList;
    this.lastUpdated = Date.now();
    return await this.save();
};

RecommendationSectionSchema.methods.refreshRecommendations = async function() {
    // Logic for refreshing recommendations based on section type
    // This would be implemented based on your recommendation algorithm
};

module.exports = mongoose.model('RecommendationSection', RecommendationSectionSchema);