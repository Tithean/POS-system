const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const register = async (req, res, next) => {
  const { Password } = req.body;
  if (!Password) {
    return res.status(400).json({ message: "Password is required" });
  }
  const hashPassword = await bcrypt.hash(Password, 10);
  req.body.Password = hashPassword;
  next();
};

const login = async (req, res, next) => {
  next();
};

const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    req.cookies?.jwt ||
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized, token is required. Please login first" });
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userData = await userModel.findById(user.id).select("-Password");

    if (!userData) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }
    req.user = userData;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  register,
  login,
  checkAuth,
};
