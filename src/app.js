const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-domain.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.json()); // JSON formatını okumayı etkinleştir
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));


// Debug için gelen isteği göster
app.use((req, res, next) => {
  console.log(`📩 Gelen İstek: ${req.method} ${req.url}`);
  console.log("📝 Body:", req.body);
  next();
});

// Add this before route definitions
console.log("🔍 Starting route registration...");

// Route'ları tanımla
console.log("✅ API Yükleniyor...");
console.log("📌 Auth Routes Eklendi: /api/auth");
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
console.log("✅ Auth Routes registered at: /api/auth");

// Add this after routes are registered
console.log("\n📍 Registered Routes:");
app._router.stack.forEach((middleware) => {
    if (middleware.route) { // routes registered directly on the app
        console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') { // router middleware 
        middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                const path = handler.route.path;
                const methods = Object.keys(handler.route.methods);
                console.log(`${methods} /api/auth${path}`);
            }
        });
    }
});

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
