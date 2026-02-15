const mongoose = require("mongoose");

const FanPostSchema = new mongoose.Schema({
  authorName: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
    maxlength: [30, "Name cannot exceed 30 characters"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    maxlength: [500, "Post cannot exceed 500 characters"],
  },
  imagePath: {
    type: String,
    default: null,
  },
  likes: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FanPost", FanPostSchema);
