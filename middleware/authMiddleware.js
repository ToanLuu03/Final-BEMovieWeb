const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 👉 Dùng decoded.userId thay vì decoded.id
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            console.log('User not found in DB for ID:', decoded.userId); // 🛠 Debug
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('JWT Error:', error); // 🛠 Debug lỗi JWT
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
