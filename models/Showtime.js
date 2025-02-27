// models/Showtime.js
const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
    showDate: { type: Date, required: true },
    timeSlots: [String], // Ví dụ: ["10:00", "14:00", "18:00", "21:00"]
    price: { type: Number, required: true },
    availableSeats: [String] // Ví dụ: ["A1", "A2", "B1", "B2"]
}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);
