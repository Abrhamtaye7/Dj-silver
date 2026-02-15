const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  eventType: {
    type: String,
    enum: ["Club", "Corporate", "Production", "Festival", "Private"],
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  budgetRange: {
    type: String,
    default: "Not Specified",
  },
  message: String,
  status: {
    type: String,
    enum: ["unread", "read", "archived"],
    default: "unread",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
