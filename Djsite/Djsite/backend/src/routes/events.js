const express = require("express");
const Event = require("../models/Event");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

module.exports = router;
