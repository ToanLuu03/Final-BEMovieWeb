// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get_all/movies', movieController.getAllMovies);
router.post('/create/movies', authMiddleware, movieController.createMovie);     
router.get('/search/movies', movieController.searchMovies);            
router.get('/get_movie_by_id/:id', movieController.getMovieById);                 
router.put('/update_movie_by_id/:id', authMiddleware, movieController.updateMovie);  
router.delete('/delete_movie_by_id/:id', authMiddleware, movieController.deleteMovie); 

module.exports = router;
