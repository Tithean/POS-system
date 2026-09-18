const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("This origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);

// app.use(cors(corsOptions));

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
