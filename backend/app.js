const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());

const frontendUrls = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  ...frontendUrls,
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/+$/, "");
      let isAllowed = allowedOrigins.includes(cleanOrigin);

      // Also allow Vercel preview/production deployments
      if (!isAllowed) {
        try {
          const { hostname } = new URL(origin);
          if (hostname.endsWith(".vercel.app")) {
            isAllowed = true;
          }
        } catch (_) {}
      }

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "POS System Backend API is running",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

const registerCrud = require("./routes/crud.routes");
const productTypeModel = require("./models/producttype.model");
const userModel = require("./models/user.model");
const invoiceModel = require("./models/invoice.model");

app.use("/producttype", registerCrud(productTypeModel));
app.use("/user", registerCrud(userModel));
app.use("/invoice", registerCrud(invoiceModel));
app.use("/", require("./routes/auth.routes"));
app.use("/", require("./routes/dashboard.routes"));
app.use("/", require("./routes/upload.routes"));
app.use("/", require("./routes/sale.routes"));
app.use("/", require("./routes/invoice.routes"));

module.exports = app;
