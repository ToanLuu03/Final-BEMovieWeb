// models/Showtime.js
const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
    showDate: { type: Date, required: true },
    timeSlots: [{ startTime: String, endTime: String }], 
    price: { type: Number, required: true },
    availableSeats: [String],
    bookedSeats: [String], 
}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);
