// models/Showtime.js
const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
    showDate: { type: Date, required: true },
    timeSlots: [{ startTime: String, endTime: String }], // Chi tiết hơn
    price: { type: Number, required: true },
    availableSeats: [String],// Ví dụ: ["A1", "A2", "B1", "B2"]
    bookedSeats: [String], // Danh sách ghế đã đặt
}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);
