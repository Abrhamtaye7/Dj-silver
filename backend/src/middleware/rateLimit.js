const rateLimit = require("express-rate-limit");

const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: { message: "Too many booking attempts. Try again later." },
});

const fanPostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: "Too many posts. Try again later." },
});

const merchOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many merch order attempts. Try again later." },
});

module.exports = { bookingLimiter, fanPostLimiter, merchOrderLimiter };
