const Theater = require('../models/Theater');
const Showtime = require('../models/Showtime');

// Lấy danh sách rạp chiếu
exports.getTheaters = async (req, res) => {
    try {
        const { city, facilities, page = 1, limit = 10 } = req.query;
        const query = {};

        if (city) query['location.city'] = city;
        if (facilities) query['facilities'] = { $in: facilities.split(',') };

        const theaters = await Theater.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json(theaters);
    } catch (error) {
        res.status(500).json({ error: 'Error getting theater list!' });
    }
};

// Lấy thông tin chi tiết rạp chiếu
exports.getTheaterById = async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id)
            .populate({
                path: 'showtimes', // ✅ Đảm bảo đúng 'showtimes' (theaterSchema)
                populate: {
                    path: 'movie', // ✅ Đảm bảo đúng 'movie' (showtimeSchema)
                    select: 'title posterUrl' // ✅ Lấy đúng trường
                }
            });

        if (!theater) return res.status(404).json({ error: 'Theater not found!' });

        res.json(theater);
    } catch (error) {
        console.error(error); // ⚠️ In lỗi ra console để debug
        res.status(500).json({ error: 'Error retrieving theater information!' });
    }
};
// Lấy tất cả rạp chiếu (không phân trang)
exports.getAllTheaters = async (req, res) => {
    try {
        const theaters = await Theater.find();
        res.json(theaters);
    } catch (error) {
        res.status(500).json({ error: 'Error getting all theaters!' });
    }
};
