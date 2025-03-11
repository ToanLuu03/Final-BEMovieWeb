const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true }, // Tránh lỗi duplicate key với null
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    favMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] // Danh sách phim yêu thích
}, { timestamps: true });

// Hash password khi lưu (không áp dụng cho Google OAuth)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);
