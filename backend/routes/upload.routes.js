const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env.local"), quiet: true });
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024, files: 1 },
  fileFilter(req, file, cb) {
    cb(["image/jpeg", "image/png"].includes(file.mimetype)
      ? null : new Error("Please choose a JPEG or PNG image"), true);
  },
});
const crud = require("../controllers/crud.upload.controller");
const productmodel = require("../models/product.model");

const express = require("express");
const route = express.Router();

// Keep the frontend's existing /upload/<filename> image URLs.
route.get("/upload/:filename", (req, res, next) => {
  const filename = req.params.filename;
  if (!/^cloudinary-pos-[a-f0-9-]{36}$/.test(filename)) return next();
  if (!process.env.CLOUDINARY_URL) return res.sendStatus(503);
  const cloudName = new URL(process.env.CLOUDINARY_URL).hostname;
  res.redirect(`https://res.cloudinary.com/${cloudName}/image/upload/${filename.slice(11)}`);
});
route.use("/upload", express.static(path.join(__dirname, "../uploads")));

route.get("/product", crud.listAll(productmodel, ["ProductName"]));
route.post(
  "/product",
  upload.single("Picture"),
  crud.create(productmodel, "Picture"),
);
// route.delete("/product/", crud.removeAll(productmodel));
route.get("/product/:id", crud.getOne(productmodel));
route.delete("/product/:id", crud.remove(productmodel, "Picture"));
route.put(
  "/product/:id",
  upload.single("Picture"),
  crud.update(productmodel, "Picture"),
);
// route.get("/product", crud.getAll(productmodel));
// route.get("/product/:id", crud.getById(productmodel));
// route.put("/product/:id", upload.single("Picture"), crud.update(productmodel));
// route.delete("/product/:id", crud.remove(productmodel));

route.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  res.status(400).json({ error: error.code === "LIMIT_FILE_SIZE"
    ? "Image must be 4 MB or smaller" : "Invalid upload. Please choose a JPEG or PNG image and try again." });
});

module.exports = route;
