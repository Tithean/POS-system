const mongoose = require("mongoose");

// Invoice
const invoiceSchema = new mongoose.Schema(
  {
    InvID: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      unique: true,
      index: true,
    },
    InvoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    TotalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

// Invoice Details
const invoiceDetailSchema = new mongoose.Schema(
  {
    InvoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    ProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    Quantity: {
      type: Number,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    TotalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const invoiceModel = mongoose.model("Invoice", invoiceSchema);
const invoiceDetailModel = mongoose.model("InvoiceDetail", invoiceDetailSchema);

module.exports = { invoiceModel, invoiceDetailModel };
