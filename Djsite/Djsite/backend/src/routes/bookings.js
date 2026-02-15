const express = require("express");
const Booking = require("../models/Booking");
const { bookingLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.post("/", bookingLimiter, async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ message: "Booking submitted", bookingId: booking._id });
  } catch (error) {
    res.status(400).json({ message: "Invalid booking data" });
  }
});

module.exports = router;
