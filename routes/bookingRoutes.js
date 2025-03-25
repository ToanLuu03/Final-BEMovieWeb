const express = require("express");
const bookingController = require("../controllers/bookingController");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/booking/add_booking", authMiddleware, bookingController.createBooking); 
router.get("/booking/get_booking_details/:id", authMiddleware, bookingController.getBookingById); 
router.get("/booking/getBookedSeatsByShowtime/:showtimeId", authMiddleware, bookingController.getBookedSeatsByShowtime); 
router.patch("/booking/:id/payForBooking", authMiddleware, bookingController.payForBooking); 
router.delete("/booking/cancel/:id", authMiddleware, bookingController.cancelBooking);
router.get("/booking/get_tickets_by_user/:userId", authMiddleware, bookingController.getTicketsByUser);

module.exports = router;
