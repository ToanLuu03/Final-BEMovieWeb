const User = require('../models/User');
const Movie = require('../models/Movie');

// Lấy danh sách phim yêu thích của user
exports.getFavoriteMovies = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate({
            path: 'favMovies'
        });

        if (!user) return res.status(404).json({ error: 'User not found!' });

        res.status(200).json({
            status: 'Successful',
            data: user.favMovies
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving favorite movies!' });
    }
};

// Thêm phim vào danh sách yêu thích
exports.addFavoriteMovie = async (req, res) => {
    try {
        const { userId, movieId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found!' });

        const movie = await Movie.findById(movieId);
        if (!movie) return res.status(404).json({ error: 'Movie not found!' });

        if (user.favMovies.some(favMovie => favMovie.toString() === movieId)) {
            return res.status(400).json({ error: 'Movie is already in favorites!' });
        }

        user.favMovies.push(movieId);
        await user.save();

        res.status(200).json({
            message: 'Movie added to favorites!',
            favMovies: user.favMovies
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding favorite movie!' });
    }
};

// Xóa phim khỏi danh sách yêu thích
exports.removeFavoriteMovie = async (req, res) => {
    try {
        const { userId, movieId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found!' });

        if (!user.favMovies.some(favMovie => favMovie.toString() === movieId)) {
            return res.status(400).json({ error: 'Movie is not in favorites!' });
        }

        user.favMovies = user.favMovies.filter(id => id.toString() !== movieId);
        await user.save();

        res.status(200).json({
            message: 'Movie removed from favorites!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing favorite movie!' });
    }
};
