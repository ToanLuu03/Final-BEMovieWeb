const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');
const authMiddleware = require('../middleware/authMiddleware');

// Lấy danh sách suất chiếu cho một phim cụ thể
router.get('/get_showtime_movie/:movieId', authMiddleware, showtimeController.getShowtimesByMovie);

// Lấy danh sách suất chiếu theo rạp cụ thể
router.get('/theater/:theaterId', authMiddleware, showtimeController.getShowtimesByTheater);

// Lấy tất cả suất chiếu hợp lệ
router.get('/valid_showtimes', authMiddleware, showtimeController.getAllValidShowtimes);

// Tạo mới suất chiếu
router.post('/showtime/add_new_showtime', authMiddleware, showtimeController.createShowtime);

// Cập nhật suất chiếu
router.put('/showtime/update_showtime/:id', authMiddleware, showtimeController.updateShowtime);

// Xóa suất chiếu
router.delete('/showtime/delete_showtime/:id', authMiddleware, showtimeController.deleteShowtime);

module.exports = router;
