const express = require("express");
const fs = require("fs");
const path = require("path");
const FanPost = require("../models/FanPost");
const Comment = require("../models/Comment");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.delete("/fans/:id", requireAdmin, async (req, res) => {
  try {
    const post = await FanPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.imagePath) {
      const relativePath = post.imagePath.replace(/^\/+/, "");
      const filePath = path.join(__dirname, "..", "..", "..", relativePath);
      fs.unlink(filePath, () => {});
    }

    await Comment.deleteMany({ postId: post._id });
    await post.deleteOne();

    return res.json({ message: "Post removed" });
  } catch (error) {
    return res.status(500).json({ message: "Could not delete post" });
  }
});

module.exports = router;
