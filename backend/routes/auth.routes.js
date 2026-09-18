const express = require("express");
const route = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

route.post("/register", authMiddleware.register, authController.register);
route.post("/login", authController.login, authController.login);
route.get("/auth/check", authMiddleware.checkAuth, authController.checkAuth);
route.post("/logout", authController.logout);

module.exports = route;
