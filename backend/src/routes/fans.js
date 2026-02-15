const express = require("express");
const FanPost = require("../models/FanPost");
const Comment = require("../models/Comment");
const upload = require("../middleware/upload");
const { fanPostLimiter } = require("../middleware/rateLimit");
const {
  isCloudinaryEnabled,
  uploadImageBuffer,
} = require("../utils/cloudinary");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await FanPost.find().sort({ createdAt: -1 });
    const comments = await Comment.find({
      postId: { $in: posts.map((post) => post._id) },
    }).sort({ createdAt: -1 });

    res.json({ posts, comments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch fan posts" });
  }
});

router.post("/", fanPostLimiter, upload.single("image"), async (req, res) => {
  try {
    let imagePath = null;

    if (req.file) {
      if (isCloudinaryEnabled) {
        const baseName = req.file.originalname
          ? req.file.originalname.replace(/\.[^/.]+$/, "")
          : "fan-upload";
        const safeBase = baseName.replace(/\s+/g, "-").toLowerCase();
        const uploadResult = await uploadImageBuffer(
          req.file.buffer,
          `${safeBase}-${Date.now()}`
        );
        imagePath = uploadResult.secure_url;
      } else if (req.file.filename) {
        imagePath = `/uploads/fans/${req.file.filename}`;
      }
    }

    const post = await FanPost.create({
      authorName: req.body.authorName,
      content: req.body.content,
      imagePath,
    });

    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    res.status(400).json({ message: error.message || "Invalid post data" });
  }
});

router.post("/:id/like", async (req, res) => {
  try {
    const ip = req.ip;
    const post = await FanPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likes = new Set(post.likes);
    if (likes.has(ip)) {
      likes.delete(ip);
    } else {
      likes.add(ip);
    }

    post.likes = Array.from(likes);
    await post.save();

    return res.json({ likes: post.likes.length });
  } catch (error) {
    return res.status(500).json({ message: "Could not update like" });
  }
});

router.post("/:id/comments", async (req, res) => {
  try {
    const post = await FanPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      postId: post._id,
      authorName: req.body.authorName,
      content: req.body.content,
    });

    return res.status(201).json({ comment });
  } catch (error) {
    return res.status(400).json({ message: "Invalid comment data" });
  }
});

module.exports = router;
