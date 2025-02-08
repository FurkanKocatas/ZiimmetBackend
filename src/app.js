const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();

// Middleware'ler
app.use(express.json()); // JSON formatını okumayı etkinleştir
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));


// Debug için gelen isteği göster
app.use((req, res, next) => {
  console.log(`📩 Gelen İstek: ${req.method} ${req.url}`);
  console.log("📝 Body:", req.body);
  next();
});

// Route'ları tanımla
console.log("✅ API Yükleniyor...");
console.log("📌 Auth Routes Eklendi: /api/auth");
app.use("/api/auth", authRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.send("Zimmet Backend Çalışıyor!");
});

module.exports = app;
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`✅ Yüklü Route: ${r.route.path}`);
  }
});
