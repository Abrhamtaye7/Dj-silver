const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const normalize = (value) => (value || "").toString().trim();
  const inputEmail = normalize(email).toLowerCase();
  const inputPassword = normalize(password);
  const storedEmail = normalize(adminEmail).toLowerCase();
  const storedPassword = normalize(adminPassword);

  if (!adminEmail || !adminPassword || !process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Auth not configured" });
  }

  if (!inputEmail || !inputPassword) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (inputEmail !== storedEmail || inputPassword !== storedPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin", email: adminEmail },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});

module.exports = router;
