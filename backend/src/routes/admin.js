const express = require("express");
const fs = require("fs");
const path = require("path");
const FanPost = require("../models/FanPost");
const Comment = require("../models/Comment");
const MerchOrder = require("../models/MerchOrder");
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

router.get("/merch/orders", requireAdmin, async (req, res) => {
  try {
    const orders = await MerchOrder.find().sort({ createdAt: -1 }).limit(200);
    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch merch orders" });
  }
});

router.patch("/merch/orders/:id/status", requireAdmin, async (req, res) => {
  const allowed = ["pending", "confirmed", "shipped", "cancelled"];
  const nextStatus = (req.body.status || "").toString().toLowerCase();

  if (!allowed.includes(nextStatus)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await MerchOrder.findByIdAndUpdate(
      req.params.id,
      { status: nextStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ message: "Order updated", order });
  } catch (error) {
    return res.status(500).json({ message: "Could not update order status" });
  }
});

module.exports = router;
