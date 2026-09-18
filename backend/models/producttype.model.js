const mongoose = require("mongoose");
const producttypeSchema = new mongoose.Schema({
  ProductType: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
  },
});

const producttypeModel =
  mongoose.models.ProductType || mongoose.model("ProductType", producttypeSchema);

module.exports = producttypeModel;
