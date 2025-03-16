const express = require('express');
const router = express.Router();
const theaterController = require('../controllers/theaterController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/search/get_theaters', theaterController.getTheaters);
router.get('/get_theater_detail/:id', theaterController.getTheaterById);
router.get('/get_all_theater', theaterController.getAllTheaters);

module.exports = router;
