const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const eventsRoutes = require("./routes/events");
const bookingsRoutes = require("./routes/bookings");
const fansRoutes = require("./routes/fans");
const merchRoutes = require("./routes/merch");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const isServerless =
  process.env.VERCEL === "1" ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

const createApp = () => {
  const app = express();

  app.set("trust proxy", isServerless ? 1 : false);
  app.use(cors());
  app.use(express.json());
  if (!isServerless) {
    app.use(
      "/uploads",
      express.static(path.join(__dirname, "..", "..", "uploads"))
    );

    const fanUploadDir = path.join(__dirname, "..", "..", "uploads", "fans");
    if (!fs.existsSync(fanUploadDir)) {
      fs.mkdirSync(fanUploadDir, { recursive: true });
    }
  }

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/events", eventsRoutes);
  app.use("/api/bookings", bookingsRoutes);
  app.use("/api/fans", fansRoutes);
  app.use("/api/merch", merchRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);

  app.use((err, req, res, next) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Request error" });
    }
    return next();
  });

  return app;
};

module.exports = createApp;
