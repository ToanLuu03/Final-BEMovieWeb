const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/user/get_fav_movies/:userId', authMiddleware, userController.getFavoriteMovies);
router.post('/:userId/add_fav_movies/:movieId', authMiddleware, userController.addFavoriteMovie);
router.post('/:userId/remove_fav_movie/:movieId', authMiddleware, userController.removeFavoriteMovie);
router.get('/token/get_id_user', authMiddleware, userController.getIdFromToken);

module.exports = router;
