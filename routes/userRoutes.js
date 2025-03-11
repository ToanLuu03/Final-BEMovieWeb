const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/user/get_fav_movies/:userId', userController.getFavoriteMovies);
router.post('/:userId/add_fav_movies/:movieId', userController.addFavoriteMovie);
router.post('/:userId/remove_fav_movie/:movieId', userController.removeFavoriteMovie);

module.exports = router;
