const jwt = require("jsonwebtoken");

// **Kullanıcı Yetkilendirme Middleware**
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Yetkilendirme reddedildi, token eksik." });
  }

  try {
    // "Bearer ..." formatındaki token'ı temizle
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // Kullanıcı bilgilerini `req.user` içine koy
    next();
  } catch (error) {
    res.status(401).json({ message: "Geçersiz token" });
  }
};

// **Sadece Adminlerin Erişebileceği Middleware**
const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Yetkilendirme reddedildi." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Bu işlemi yapmak için yetkiniz yok!" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
