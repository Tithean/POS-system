const express = require("express");
const route = express.Router();
const dashboard = require("../controllers/dasboard.controller");
const { checkAuth } = require("../middlewares/auth.middleware");

route.get("/dashboard", dashboard);

module.exports = route;
