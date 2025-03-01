const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');

// 1. Lấy danh sách suất chiếu cho từng phim cụ thể
exports.getShowtimesByMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        const showtimes = await Showtime.find({
            movie: movieId,
            showDate: { $gte: new Date() }
        }).populate('movie', 'title')
            .populate('theater', 'location');
        res.status(200).json({ success: true, showtimes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
// 2. Lấy danh sách suất chiếu theo rạp cụ thể
exports.getShowtimesByTheater = async (req, res) => {
    try {
        const { theaterId } = req.params;

        const showtimes = await Showtime.find({
            theater: theaterId,
            showDate: { $gte: new Date().setHours(0, 0, 0, 0) }
        })
            .populate('movie', 'title')
            .populate('theater', 'name address');

        res.status(200).json({ success: true, showtimes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};
// 3. Lấy tất cả suất chiếu hợp lệ (chưa hết hạn)
exports.getAllValidShowtimes = async (req, res) => {
    try {
        const showtimes = await Showtime.find({
            showDate: { $gte: new Date().setHours(0, 0, 0, 0) }
        })
            .populate('movie', 'title')
            .populate('theater', 'location');

        res.status(200).json({ success: true, showtimes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// 4. Tạo mới suất chiếu
exports.createShowtime = async (req, res) => {
    try {
        const { movie, theater, showDate, timeSlots, price, availableSeats } = req.body;

        const newShowtime = new Showtime({
            movie,
            theater,
            showDate,
            timeSlots,
            price,
            availableSeats,
            bookedSeats: []
        });

        await newShowtime.save();
        res.status(201).json({ success: true, showtime: newShowtime });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};


// 5. Cập nhật suất chiếu
exports.updateShowtime = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedShowtime = await Showtime.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedShowtime) {
            return res.status(404).json({ success: false, message: 'No showtimes found.' });
        }

        res.status(200).json({ success: true, showtime: updatedShowtime });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// 6. Xóa suất chiếu
exports.deleteShowtime = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedShowtime = await Showtime.findByIdAndDelete(id);
        if (!deletedShowtime) {
            return res.status(404).json({ success: false, message: 'No showtimes found.' });
        }

        res.status(200).json({ success: true, message: 'Showtime deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};