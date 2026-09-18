const express = require("express");
const crud = require("../controllers/crud.controller.js");
const { checkAuth } = require("../middlewares/auth.middleware");
const routes = (Model) => {
  console.log("Model in routes:", Model); // Log the Model to verify it's being passed correctly

  const router = express.Router();
  router.post("/", crud.create(Model));
  router.get("/", crud.getAll(Model));
  router.get("/:id", crud.getById(Model));
  router.put("/:id", crud.update(Model));
  router.delete("/:id", crud.remove(Model));

  return router;
};

module.exports = routes;
