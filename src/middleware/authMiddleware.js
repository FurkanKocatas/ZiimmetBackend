const jwt = require("jsonwebtoken");

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

module.exports = authMiddleware;
