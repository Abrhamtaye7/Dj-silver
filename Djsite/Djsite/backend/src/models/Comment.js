const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FanPost",
    required: true,
  },
  authorName: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: [300, "Comment is too long"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
