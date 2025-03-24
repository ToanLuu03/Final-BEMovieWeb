const Booking = require("../models/Booking");
const Ticket = require("../models/Ticket");
const Showtime = require("../models/Showtime");

// 📌 1. Tạo đặt vé
exports.createBooking = async (req, res) => {
    try {
        const { userId, showtimeId, movieId, theaterId, seats, totalPrice } = req.body;

        // Kiểm tra suất chiếu
        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
            return res.status(404).json({ message: "Showtime not found!" });
        }

        // Kiểm tra ghế có bị đặt trước đó không
        const alreadyBooked = seats.filter(seat => showtime.bookedSeats.includes(seat));
        if (alreadyBooked.length > 0) {
            return res.status(400).json({ message: `Seats ${alreadyBooked.join(", ")} are already booked!` });
        }

        // 🔹 Tạo booking trước
        const newBooking = new Booking({
            user: userId,
            showtime: showtimeId,
            movie: movieId,
            theater: theaterId,
            totalPrice,
            tickets: [] // Ban đầu rỗng, lát nữa cập nhật lại
        });

        const savedBooking = await newBooking.save();

        // 🔹 Tạo danh sách vé
        const tickets = seats.map(seat => ({
            booking: savedBooking._id,
            user: userId,
            movie: movieId,
            showtime: showtimeId,
            theater: theaterId,
            seatNumber: seat,
            ticketPrice: showtime.price,
            totalPrice: showtime.price, // Tổng giá vé cho 1 chỗ ngồi
            paymentStatus: "pending",
        }));

        // 🔹 Lưu vé vào DB
        const savedTickets = await Ticket.insertMany(tickets);

        // 🔹 Cập nhật danh sách `tickets` trong `booking`
        await Booking.findByIdAndUpdate(savedBooking._id, {
            $set: { tickets: savedTickets.map(ticket => ticket._id) }
        });

        // 🔹 Cập nhật trạng thái ghế trong `Showtime`
        await Showtime.findByIdAndUpdate(showtimeId, {
            $pull: { availableSeats: { $in: seats } },  // Xóa khỏi danh sách ghế trống
            $push: { bookedSeats: { $each: seats } }  // Thêm vào danh sách ghế đã đặt
        });

        res.status(201).json({
            message: "Ticket booking successful!",
            booking: { ...savedBooking._doc, tickets: savedTickets.map(ticket => ticket._id) }, // Đính kèm danh sách vé
            tickets: savedTickets
        });
    } catch (error) {
        res.status(500).json({ message: "Server error!", error });
    }
};


// 📌 2. Lấy chi tiết đặt vé
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("user")
            .populate("movie")
            .populate("theater")
            .populate("showtime")
            .populate("tickets");

        if (!booking) return res.status(404).json({ message: "No booking found!" });

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: "Server error!", error });
    }
};

// 📌 3. Lấy danh sách ghế đã đặt theo suất chiếu
exports.getBookedSeatsByShowtime = async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.showtimeId);
        if (!showtime) return res.status(404).json({ message: "Showtime not found!" });

        res.json(showtime.bookedSeats);
    } catch (error) {
        res.status(500).json({ message: "Server error!", error });
    }
};


// 📌 4. Xác nhận thanh toán đặt vé
exports.payForBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "No booking found!" });

        // Kiểm tra nếu vé đã được thanh toán
        if (booking.paymentStatus === "paid") {
            return res.status(400).json({ message: "This booking has already been paid!" });
        }

        // Cập nhật trạng thái thanh toán
        booking.paymentStatus = "paid";
        await booking.save();

        // Cập nhật tất cả vé thuộc booking này thành "paid"
        await Ticket.updateMany({ booking: booking._id }, { $set: { paymentStatus: "paid" } });

        res.json({ message: "Payment successful!", booking });
    } catch (error) {
        res.status(500).json({ message: "Server error!", error });
    }
};
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "No booking found!" });

        // Lấy danh sách vé từ booking
        const tickets = await Ticket.find({ booking: booking._id });

        // Lấy danh sách ghế cần hoàn lại
        const seatsToRelease = tickets.map(ticket => ticket.seatNumber);

        // Xóa vé
        await Ticket.deleteMany({ booking: booking._id });

        // Xóa đặt vé
        await Booking.findByIdAndDelete(req.params.id);

        // Cập nhật lại danh sách ghế trong Showtime
        await Showtime.findByIdAndUpdate(booking.showtime, {
            $pull: { bookedSeats: { $in: seatsToRelease } },  // Xóa khỏi ghế đã đặt
            $push: { availableSeats: { $each: seatsToRelease } }  // Thêm lại vào ghế trống
        });

        res.json({ message: "Booking canceled and seats are now available again!" });
    } catch (error) {
        res.status(500).json({ message: "Server error!", error });
    }
};
exports.getTicketsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Tìm tất cả các đơn đặt vé của user
        const bookings = await Booking.find({ user: userId })
            .populate("movie")
            .populate("theater")
            .populate("showtime")
            .populate("tickets");

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No tickets found for this user!" });
        }

        // Tạo danh sách vé từ bookings
        const tickets = bookings.flatMap(booking =>
            booking.tickets.map(ticket => ({
                ticketId: ticket._id,
                movie: booking.movie.title,
                moviePoster: booking.movie.posterUrl,
                theater: booking.theater.name,
                address: booking.theater.location.address,
                showDate: booking.showtime.showDate,
                showTime: booking.showtime.timeSlots[0].startTime, // Giả sử chỉ lấy suất đầu tiên
                seatNumber: ticket.seatNumber,
                totalPrice: ticket.totalPrice,
                paymentStatus: ticket.paymentStatus,
                status: ticket.status,
            }))
        );

        res.json({ tickets });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: "Server error!", error });
    }
};
