const mongoose = require("mongoose");
const productModel = require("../models/product.model");
const { invoiceModel, invoiceDetailModel } = require("../models/invoice.model");

const sale = async (req, res) => {
  try {
    const request_body = req.body;

    console.log("request_body", request_body);

    if (request_body.length === 0) {
      return res.status(400).json({
        message: "No products to sale",
      });
    }

    // Update product quantity
    await Promise.all(
      request_body?.cart.map(async (item) => {
        const product = await productModel.findById(item.prod_id);
        if (product) {
          console.log("product", product);
          product.NumberInStock -= item.qty;
          await product.save();
        }
      }),
    );

    // Create invoice
    const invoice = new invoiceModel({
      InvoiceNumber: `INV-${Date.now()}`,
      TotalAmount: request_body?.cart.reduce(
        (acc, item) => acc + item.qty * item.price,
        0,
      ),
    });
    await invoice.save();

    // Create invoice details
    await Promise.all(
      request_body?.cart.map(async (item) => {
        const invoiceDetail = new invoiceDetailModel({
          InvoiceId: invoice._id,
          ProductId: item.prod_id,
          Quantity: item.qty,
          Price: item.price,
          TotalAmount: item.qty * item.price,
        });
        await invoiceDetail.save();
      }),
    );

    return res.status(200).json({
      message: "sale",
      status: "success",
    });
  } catch (error) {
    console.error("Error occurred while processing sale:", error);
    return res.status(500).json({
      message: "Error occurred while processing sale",
      status: "error",
    });
  }
};

const get_sale = async (req, res) => {
  const productType = req.query.type || "";
  const queryObj = {};

  if (productType && productType != "ALL") {
    queryObj["ProductType"] = new mongoose.Types.ObjectId(productType);
  }

  const product = await productModel.find(queryObj);

  return res.status(200).json({
    message: "product to sale",
    data: product,
  });
};

module.exports = { sale, get_sale };
