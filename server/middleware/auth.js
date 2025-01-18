const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        // Get the JWT pass from the request
        const token = req.headers.authorization?.split(' ')[1];
        
        // If no pass, reject entry
        if (!token) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        // Check if pass is valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // If pass is valid, let them through
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Not authorized' });
    }
};

module.exports = protect;