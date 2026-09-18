const { sale, get_sale } = require("../controllers/sale.controller");
const express = require("express");
const route = express.Router();

route.post("/sale", sale);
route.get("/sale", get_sale);

module.exports = route;
