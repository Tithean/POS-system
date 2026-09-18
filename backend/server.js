require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

const startServer = async () => {
  await connectDB();
  const port = process.env.PORT || 8000;
  app.listen(port);
};

startServer().catch((error) => {
  console.error("Could not start server:", error);
  process.exit(1);
});
