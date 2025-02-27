const express = require('express');
const passport = require('passport');
const {
    register,
    login,
    logout,
    googleAuth
} = require('../controllers/authController');

const router = express.Router();

// Đăng ký & Đăng nhập
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Xác thực bằng Google
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account' // ⚠️ Thêm để luôn chọn tài khoản

    })
);

// Callback sau khi xác thực Google
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    googleAuth
);

module.exports = router;
