const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

const register = async (req, res) => {
  try {
    const userdata = { ...req.body };
    if (
      !userdata.Username ||
      !userdata.Password ||
      !userdata.Email ||
      !userdata.Gender ||
      !userdata.DateOfBirth
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const email = userdata.Email.toLowerCase().trim();
    const existing = await userModel.findOne({ Email: email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    userdata.Email = email;
    if (!userdata.UserID) {
      userdata.UserID = "USR-" + Date.now();
    }
    // Remove empty phone/address so duplicate empty indexes are not triggered
    if (!userdata.Phone) {
      delete userdata.Phone;
    }

    const user = await userModel.create(userdata);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Registered successfully",
      token: token,
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "Field";
      return res.status(400).json({ message: `${field} already exists` });
    }
    return res.status(500).json({ message: error.message || "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Check user exists
    const user = await userModel.findOne({ Email: Email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check password
    const result = await bcrypt.compare(Password, user.Password);
    if (result) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res
        .status(200)
        .json({ message: "Login Successfully", token: token, user });
    } else {
      return res.status(400).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: error.message || "Login failed" });
  }
};

const checkAuth = async (req, res) => {
  return res.status(200).json({
    authenticated: true,
    user: req.user,
  });
};

const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
  return res.status(200).json({ message: "Logout Successfully" });
};

module.exports = {
  register,
  login,
  checkAuth,
  logout,
};
