const express = require('express');
const router = express.Router();
const theaterController = require('../controllers/theaterController');
const authMiddleware = require('../middleware/authMiddleware');

// Lấy danh sách rạp chiếu
router.get('/search/get_theaters', authMiddleware, theaterController.getTheaters);

// Lấy thông tin chi tiết rạp chiếu
router.get('/get_theater_detail/:id', authMiddleware, theaterController.getTheaterById);

module.exports = router;
