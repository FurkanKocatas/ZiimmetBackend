const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

console.log("🛠️ authRoutes dosyası çalışıyor!");

router.post("/register", (req, res) => {
  console.log("🚀 /register endpoint'i çalıştı!");
  res.json({ message: "Register çalışıyor!" });
});

router.post("/login", (req, res) => {
  console.log("🚀 /login endpoint'i çalıştı!");
  res.json({ message: "Login çalışıyor!" });
});

module.exports = router;
