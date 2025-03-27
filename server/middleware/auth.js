const jwt = require('jsonwebtoken');

//middleware to protect routes
const protect = async (req, res, next) => {
    try {
        //get token from headers
        const token = req.headers.authorization?.split(' ')[1];
        
        //if no token, return error
        if (!token) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        //if token is valid, set req.user to the decoded token
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Not authorized' });
    }
};



module.exports = protect;