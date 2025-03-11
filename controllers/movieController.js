// controllers/movieController.js
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime'); 
const Review = require('../models/Review'); 
// 🟢 Tạo mới phim
exports.createMovie = async (req, res) => {
    try {
        const newMovie = await Movie.create(req.body);
        res.status(201).json({
            status: 'Successful',
            data: newMovie
        });
    } catch (error) {
        res.status(500).json({ message: 'Unable to create movie', error });
    }
};

// 🟢 Lấy danh sách tất cả các phim
exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find()
            .populate('showtimes')
            .populate('reviews');
        
        res.status(200).json({
            status: 'Successful',
            data: movies
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ 
            message: 'Unable to get movie list', 
            error: error.message || 'An unknown error occurred' 
        });
    }
};


// 🟢 Lấy thông tin chi tiết phim theo ID
exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
            .populate('showtimes')
            .populate('reviews');

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(200).json({
            status: 'Successful',
            data: movie
        });
    } catch (error) {
        res.status(500).json({ message: 'Unable to get movie details', error });
    }
};

// 🟢 Cập nhật thông tin phim
exports.updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(200).json({
            status: 'Successful',
            data: updatedMovie
        });
    } catch (error) {
        res.status(500).json({ message: 'Unable to update movie', error });
    }
};

// 🟢 Xóa phim
exports.deleteMovie = async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

        if (!deletedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(200).json({
            status: 'Successful',
            message: 'Movie deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Unable to delete movie', error });
    }
};

// 🟢 Tìm kiếm và lọc phim (theo thể loại, ngôn ngữ, đạo diễn, hoặc tên phim)
exports.searchMovies = async (req, res) => {
    try {
        const { title, genre, director, language } = req.query;
        const query = {};

        if (title) query.title = { $regex: title, $options: 'i' };
        if (genre) query.genre = genre;
        if (director) query.director = { $regex: director, $options: 'i' };
        if (language) query.language = language;

        const movies = await Movie.find(query)
            .populate('showtimes')
            .populate('reviews');

        res.status(200).json({
            status: 'Successful',
            data: movies
        });
    } catch (error) {
        res.status(500).json({ message: 'Unable to search movies', error });
    }
};
