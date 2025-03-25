require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
connectDB();

// Middleware
app.use(express.json());

// Define a port

const animeRouter = require('./routes/anime');
app.use('/api/anime', animeRouter);

// Basic test route
app.get('/api/test', (req, res) => {
    res.json({ msg: 'API is working' });
});

const PORT = process.env.PORT || 3000;
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port 3000`);
});