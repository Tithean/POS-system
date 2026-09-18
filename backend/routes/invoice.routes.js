// import { getInvoice } from "../controllers/invoice.controller.js";
const {
  getInvoice,
  getInvoiceDetails,
} = require("../controllers/invoice.controller.js");
const express = require("express");
const route = express.Router();

route.get("/api/invoice", getInvoice);
route.get("/api/invoice/:id", getInvoiceDetails);

module.exports = route;
