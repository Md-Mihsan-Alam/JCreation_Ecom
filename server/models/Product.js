const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    imageGallery: [String],
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    stockM: Number,
    stockL: Number,
    stockXL: Number,
    stock2XL: Number,
    stock3XL: Number,
    stock4XL: Number,
    averageReview: Number,
    isNewArrival: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isNewArrival: 1 });

module.exports = mongoose.model("Product", ProductSchema);
