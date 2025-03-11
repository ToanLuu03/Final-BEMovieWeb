const express = require('express');
const router = express.Router();
const theaterController = require('../controllers/theaterController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/search/get_theaters', authMiddleware, theaterController.getTheaters);
router.get('/get_theater_detail/:id', authMiddleware, theaterController.getTheaterById);
router.get('/get_all_theater', authMiddleware, theaterController.getAllTheaters);

module.exports = router;
