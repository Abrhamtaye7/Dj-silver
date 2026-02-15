const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  venue: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Event", EventSchema);
