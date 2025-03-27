require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

//activate cors (since we are using 3001 as our port for the client)
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));
app.use(express.json());

//import the routers
const animeRouter = require('./routes/anime');
const authRouter = require('./routes/auth'); 

//mount routers
app.use('/api/anime', animeRouter);
app.use('/api/auth', authRouter);

//basic test route
app.get('/api/test', (req, res) => {
    res.json({ msg: 'API is working' });
});

const PORT = process.env.PORT || 3000;
//start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});