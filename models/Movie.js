// models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    genre: [String],
    duration: Number,
    releaseDate: Date,
    director: String,
    cast: [String],
    language: String,
    posterUrl: String,
    trailerUrl: String,
    showtimes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Showtime' }],
    rating: { type: Number, min: 0, max: 10 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
