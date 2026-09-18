const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  Picture: {
    type: String,
    default: "image.png",
  },
  ProductName: {
    type: String,
    required: true,
  },
  ProductType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductType',
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Cost: {
    type: Number,
    required: true,
  },
  NumberInStock: {
    type: Number,
    default: 0,
  },
  Note: {
    type: String,
  },
});

const productModel = new mongoose.model("Product", productSchema);

module.exports = productModel;
