const mongoose = require('mongoose');

// Cache for anime details from Jikan API
const CachedAnimeSchema = new mongoose.Schema({
    malId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    synopsis: String,
    imageUrl: String,
    genres: [String],
    streamingLinks: [{
        platform: String,
        url: String
    }],
    trailerUrl: String,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const AnimeListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    animeId: {
        type: Number,  // Jikan API ID
        required: true
    },
    status: {
        type: String,
        enum: ['watching', 'completed', 'plan_to_watch'],
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate entries for same user and anime
AnimeListSchema.index({ userId: 1, animeId: 1 }, { unique: true });

const CachedAnime = mongoose.model('CachedAnime', CachedAnimeSchema);
const AnimeList = mongoose.model('AnimeList', AnimeListSchema);

module.exports = { CachedAnime, AnimeList };