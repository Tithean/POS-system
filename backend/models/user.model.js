const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    UserID: {
      type: String,
      default: () => "USR-" + Date.now(),
    },
    Username: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Gender: {
      type: String,
      required: true,
    },
    DateOfBirth: {
      type: String,
      required: true,
    },
    Address: {
      type: String,
      default: "",
    },
    Role: {
      type: String,
      default: "user",
    },
    StartDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    Phone: {
      type: String,
    },
    Password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

if (userModel?.collection) {
  userModel.collection.dropIndex("Phone_1").catch(() => {});
}

module.exports = userModel;
