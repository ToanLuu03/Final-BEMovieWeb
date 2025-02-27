// models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
    seatNumber: { type: String, required: true }, // Ví dụ: "A1"
    ticketPrice: { type: Number, required: true },
    qrCode: { type: String }, // Lưu trữ URL hoặc mã QR nếu có
    status: { 
        type: String, 
        enum: ['valid', 'used', 'cancelled'], 
        default: 'valid' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
