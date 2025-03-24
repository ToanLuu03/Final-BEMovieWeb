const express = require("express");
const bookingController = require("../controllers/bookingController");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/booking/add_booking", authMiddleware, bookingController.createBooking); // Tạo đặt vé
router.get("/booking/get_booking_details/:id", authMiddleware, bookingController.getBookingById); // Lấy chi tiết đặt vé
router.get("/booking/getBookedSeatsByShowtime/:showtimeId", authMiddleware, bookingController.getBookedSeatsByShowtime); // Lấy danh sách ghế đã đặt
router.patch("/booking/:id/payForBooking", authMiddleware, bookingController.payForBooking); // Thanh toán đặt vé
router.delete("/booking/cancel/:id", authMiddleware, bookingController.cancelBooking);
router.get("/booking/get_tickets_by_user/:userId", authMiddleware, bookingController.getTicketsByUser);

module.exports = router;
