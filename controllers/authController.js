const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Tạo JWT Token
const createToken = (user) => {
    return jwt.sign(
        { 
            userId: user._id, 
            email: user.email,
            name: user.name,
            picture: user.picture,
            role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Đăng ký tài khoản
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists!' });
        }

        const newUser = await User.create({
            username,
            email,
            password, 
            googleId: undefined
        });

        res.status(201).json({
            message: 'Registration successful!',
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed!', error });
    }
};

// Đăng nhập tài khoản
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Email does not exist!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Wrong password!' });

        const token = createToken(user);
        res.json({
            message: 'Login successful!',
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed!', error });
    }
};

// Đăng xuất tài khoản
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Log out successfully!' });
};

// Đăng nhập bằng Google
exports.googleAuth = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication failed!' });
        }

        const token = createToken(req.user);

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
         res.redirect(`${frontendUrl}/signin?token=${token}`);
        // res.redirect(`${frontendUrl}/home?token=${token}`);
    } catch (error) {
        res.status(500).json({ message: 'Google Authentication failed!', error });
    }
};

