const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword || !process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Auth not configured" });
  }

  if (email !== adminEmail || password !== adminPassword) {
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
