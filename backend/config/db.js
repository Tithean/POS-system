const mongoose = require("mongoose");

let connection;

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!connection) {
    connection = mongoose.connect(process.env.MONGODB_URI);
  }

  return connection;
}

module.exports = connectDB;
