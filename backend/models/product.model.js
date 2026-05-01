const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a food name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
  },
  type: {
    type: String,
    enum: ["veg", "nonveg"],
    default: "veg",
  },
  image: {
    type: String,
    default: "no-food-image.jpg",
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  cookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please assign a cook to this product"],
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  isQuickPick: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please track who created this product"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
