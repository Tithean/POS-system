require("dotenv").config();
const app = require("../app");
const connectDB = require("../config/db");

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Vercel Serverless Function Error:", error);
    return res.status(500).json({
      message: "Database connection failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
