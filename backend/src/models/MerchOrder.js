const mongoose = require("mongoose");

const MerchOrderSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    trim: true,
  },
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, "Unit price must be a positive number"],
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    max: [20, "Quantity cannot exceed 20"],
  },
  size: {
    type: String,
    enum: ["XS", "S", "M", "L", "XL", "XXL", "N/A"],
    default: "N/A",
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [80, "Name is too long"],
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please add a valid email"],
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [40, "Phone number is too long"],
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: [300, "Address is too long"],
  },
  note: {
    type: String,
    trim: true,
    maxlength: [500, "Note is too long"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MerchOrder", MerchOrderSchema);
