const Booking = require("../models/Booking");
const Ticket = require("../models/Ticket");
const Showtime = require("../models/Showtime");

// 1. Tạo đặt vé
exports.createBooking = async (req, res) => {
    try {
        const { userId, showtimeId, movieId, theaterId, seats, totalPrice } = req.body;

        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
            return res.status(404).json({ message: "Showtime not found!" });
        }

        const alreadyBooked = seats.filter(seat => showtime.bookedSeats.includes(seat));
        if (alreadyBooked.length > 0) {
            return res.status(400).json({ message: `Seats ${alreadyBooked.join(", ")} are already booked!` });
        }

        const newBooking = new Booking({
            user: userId,
            showtime: showtimeId,
            movie: movieId,
            theater: theaterId,
            totalPrice,
            tickets: [] 
        });

        const savedBooking = await newBooking.save();

        const tickets = seats.map(seat => ({
            booking: savedBooking._id,
            user: userId,
            movie: movieId,
            showtime: showtimeId,
            theater: theaterId,
            seatNumber: seat,
            ticketPrice: showtime.price,
            totalPrice: showtime.price,
            paymentStatus: "pending",
        }));

        const savedTickets = await Ticket.insertMany(tickets);

        await Booking.findByIdAndUpdate(savedBooking._id, {
            $set: { tickets: savedTickets.map(ticket => ticket._id) }
        });

        await Showtime.findByIdAndUpdate(showtimeId, {
            $pull: { availableSeats: { $in: seats } },
            $push: { bookedSeats: { $each: seats } }  
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


// 2. Lấy chi tiết đặt vé
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

// 3. Lấy danh sách ghế đã đặt theo suất chiếu
exports.getBookedSeatsByShowtime = async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.showtimeId);
        if (!showtime) return res.status(404).json({ message: "Showtime not found!" });

        res.json(showtime.bookedSeats);
    } catch (error) {
        res.status(500).json({ message: "Server error!", error });
    }
};


// 4. Xác nhận thanh toán đặt vé
exports.payForBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "No booking found!" });

        if (booking.paymentStatus === "paid") {
            return res.status(400).json({ message: "This booking has already been paid!" });
        }

        booking.paymentStatus = "paid";
        await booking.save();

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

        const tickets = await Ticket.find({ booking: booking._id });

        const seatsToRelease = tickets.map(ticket => ticket.seatNumber);

        await Ticket.deleteMany({ booking: booking._id });

        await Booking.findByIdAndDelete(req.params.id);

        await Showtime.findByIdAndUpdate(booking.showtime, {
            $pull: { bookedSeats: { $in: seatsToRelease } },  
            $push: { availableSeats: { $each: seatsToRelease } }  
        });

        res.json({ message: "Booking canceled and seats are now available again!" });
    } catch (error) {
        res.status(500).json({ message: "Server error!", error });
    }
};
exports.getTicketsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const bookings = await Booking.find({ user: userId })
            .populate("movie")
            .populate("theater")
            .populate("showtime")
            .populate("tickets");

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No tickets found for this user!" });
        }

        const tickets = bookings.flatMap(booking =>
            booking.tickets.map(ticket => ({
                ticketId: ticket._id,
                movie: booking.movie.title,
                moviePoster: booking.movie.posterUrl,
                theater: booking.theater.name,
                address: booking.theater.location.address,
                showDate: booking.showtime.showDate,
                showTime: booking.showtime.timeSlots[0].startTime, 
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
