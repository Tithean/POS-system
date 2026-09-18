const userModel = require("../models/user.model");
const dashboard = async (req, res) => {
  const user = await userModel.find();
  const userValue = user.length;
  const data = [
    {
      title: "ចំណូលថ្ងៃនេះ",
      value: "0$",
      icon: "icon-dollar",
    },
    {
      title: "ចំនួនលក់ថ្ងៃនេះ",
      value: "0",
      icon: "icon-box",
    },
    {
      title: "ចំនួនទំនិញ",
      value: "0",
      icon: "icon-sell",
    },
    {
      title: "ចំនួនអ្នកប្រើប្រាស់",
      value: userValue,
      icon: "icon-user",
    },
  ];
  res.status(200).json({ message: "dashboard", data: data });
};

module.exports = dashboard;
