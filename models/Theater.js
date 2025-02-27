// models/Theater.js
const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        address: String,
        city: String,
        state: String,
        zipCode: String
    },
    phone: String,
    facilities: [String], // Ví dụ: ["3D", "IMAX", "VIP"]
    showtimes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Showtime' }]
}, { timestamps: true });

module.exports = mongoose.model('Theater', theaterSchema);
