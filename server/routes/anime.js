const express = require('express');
const router = express.Router();
const { CachedAnime } = require('../models/AnimeList');
const protect = require('../middleware/auth');
const Review = require('../models/Review');

// Existing routes ...
//search anime
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search anime' });
    }
});

// New route to fetch anime titles from JIKAN API
router.get('/titles', async (req, res) => {
    try {
        const response = await fetch('https://api.jikan.moe/v4/anime');
        const data = await response.json();
        // Map over the results to extract only the titles.
        const titles = data.data.map(anime => anime.title);
        res.json({ titles });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch anime titles' });
    }
});

// ...other routes remain unchanged
//get single anime details
router.get('/:id', async (req, res) => {
    try {
        const animeId = req.params.id;

        // .findOne() is a built-in Mongoose method
        // It looks in your CachedAnime collection for an anime where malId matches animeId
        let anime = await CachedAnime.findOne({ malId: animeId });

        // If not found in our cache
        if (!anime) {
            // Get it from Jikan API
            const response = await fetch (`https://api.jikan.moe/v4/anime/${animeId}`);
            const data = await response.json();

            // .create() is another built-in Mongoose method
            // Creates new document in CachedAnime collection
            anime = await CachedAnime.create({
                malId: data.data.mal_id,
                title: data.data.title,
                synopsis: data.data.synopsis,
                imageUrl: data.data.images.jpg.image_url,
                trailerUrl: data.data.trailer?.url,
                genres: data.data.genres.map(g => g.name)
            });
        }
        
        res.json(anime);
    } catch (error) {
        res.status(500).json({error: 'Failed to get anime details' });
    }
});

//get general recommednations (homepage sections)
router.get('/recommendations', async (req, res) => {
    try {
        // Get popular anime from Jikan
        const popularResponse = await fetch('https://api.jikan.moe/v4/top/anime');
        const popularData = await popularResponse.json();
        
        // Get seasonal anime
        const seasonalResponse = await fetch('https://api.jikan.moe/v4/seasons/now');
        const seasonalData = await seasonalResponse.json();

        // Cache all anime data
        const allAnime = [...popularData.data, ...seasonalData.data];
        for (const anime of allAnime) {
            await CachedAnime.findOneAndUpdate(
                { malId: anime.mal_id },
                {
                    malId: anime.mal_id,
                    title: anime.title,
                    synopsis: anime.synopsis,
                    imageUrl: anime.images.jpg.image_url,
                    trailerUrl: anime.trailer?.url,
                    genres: anime.genres.map(g => g.name)
                },
                { upsert: true } // Create if doesn't exist, update if does
            );
        }
        
        res.json({
            popularPicks: popularData.data.slice(0, 6),
            seasonalPicks: seasonalData.data.slice(0, 6)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
});

//post a review
router.post('/:animeId/review', protect, async (req, res) => {
    try {
        const { rating, content } = req.body;
        const animeId = req.params.animeId;
        const userId = req.user.id;

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Validate content length
        if (content && content.length > 350) {
            return res.status(400).json({ 
                error: 'Review content must be 350 characters or less' 
            });
        }

        // Create review
        const review = await Review.create({
            userId,
            animeId,
            rating,
            content: content || '',  // Handle case where content is optional
            createdAt: Date.now()
        });

        res.json({ success: true, review });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create review' });
    }
});

router.get('/top', async (req, res) => {
    try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime');
        const data = await response.json();
        // Extract the first 50 anime from the response
        const topAnime = data.data.slice(0, 50);
        res.json({ topAnime });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch top anime' });
    }
});


module.exports = router;

// TODO: Personalized Recommendation Routes
/*
router.get('/recommendations/personal', async (req, res) => {
    try {
        // Will connect to Python recommendation service
        // Get personalized recommendations based on:
        // - User watch history
        // - Ratings
        // - Similar users' preferences
        res.json({ message: "Not implemented yet" });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
});

router.get('/recommendations/sleepers', async (req, res) => {
    try {
        // Will connect to Python service for sleeper picks
        // Algorithm will consider:
        // - High ratings but low popularity
        // - Hidden gems based on user preferences
        res.json({ message: "Not implemented yet" });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get sleeper picks' });
    }
});
*/