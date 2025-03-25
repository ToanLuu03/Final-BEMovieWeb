const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get_showtime_movie/:movieId', authMiddleware, showtimeController.getShowtimesByMovie);

router.get('/theater/:theaterId', authMiddleware, showtimeController.getShowtimesByTheater);

router.get('/valid_showtimes', authMiddleware, showtimeController.getAllValidShowtimes);

router.post('/showtime/add_new_showtime', authMiddleware, showtimeController.createShowtime);

router.put('/showtime/update_showtime/:id', authMiddleware, showtimeController.updateShowtime);

router.delete('/showtime/delete_showtime/:id', authMiddleware, showtimeController.deleteShowtime);

module.exports = router;
