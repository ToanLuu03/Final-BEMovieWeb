// models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
    seatNumber: [{ type: String, required: true }], // Ví dụ: "A1"
    ticketPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }, // Tổng tiền vé
    qrCode: { type: String }, // Lưu trữ URL hoặc mã QR nếu có
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['valid', 'used', 'cancelled'],
        default: 'valid'
    }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
