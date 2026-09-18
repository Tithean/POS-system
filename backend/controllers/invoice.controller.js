const { invoiceModel, invoiceDetailModel } = require("../models/invoice.model");

const getInvoice = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const queryObj = {};

    if (startDate && endDate) {
      queryObj.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const invoiceResult = await invoiceModel.find(queryObj);

    if (!invoiceResult || invoiceResult.length === 0) {
      return res
        .status(200)
        .json({ message: "No invoice data found", data: [] });
    }

    return res.status(200).json({ data: invoiceResult });
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getInvoiceDetails = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const invoiceDetails = await invoiceDetailModel
      .find({
        InvoiceId: invoiceId,
      })
      .populate("ProductId", "ProductName"); // Populate the ProductId field with product details
    if (!invoiceDetails) {
      return res.status(404).json({ message: "Invoice details not found" });
    }
    return res.status(200).json({ data: invoiceDetails });
  } catch (error) {
    console.error("Error fetching invoice details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getInvoice, getInvoiceDetails };
