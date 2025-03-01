// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authMiddleware = require('../middleware/authMiddleware');

// Sử dụng middleware xác thực token cho route movies
router.get('/get_all/movies', authMiddleware, movieController.getAllMovies); //lay tat ca danh sach phim
router.post('/create/movies', authMiddleware, movieController.createMovie);     // Tạo mới phim (yêu cầu đăng nhập)
router.get('/search/movies', movieController.searchMovies);               // Tìm kiếm và lọc phim
router.get('/get_movie_by_id/:id', movieController.getMovieById);                  // Lấy chi tiết phim theo ID
router.put('/update_movie_by_id/:id', authMiddleware, movieController.updateMovie);   // Cập nhật phim (yêu cầu đăng nhập)
router.delete('/delete_movie_by_id/:id', authMiddleware, movieController.deleteMovie); // Xóa phim (yêu cầu đăng nhập)

module.exports = router;
