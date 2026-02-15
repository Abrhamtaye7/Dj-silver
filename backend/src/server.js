require("dotenv").config();

const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const eventsRoutes = require("./routes/events");
const bookingsRoutes = require("./routes/bookings");
const fansRoutes = require("./routes/fans");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();

app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "..", "uploads")));

const fanUploadDir = path.join(__dirname, "..", "..", "uploads", "fans");
if (!fs.existsSync(fanUploadDir)) {
  fs.mkdirSync(fanUploadDir, { recursive: true });
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/events", eventsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/fans", fansRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message || "Request error" });
  }
  return next();
});

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
