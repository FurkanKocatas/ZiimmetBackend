const express = require("express");
const { register, login,externalLogin } = require("../controllers/authController");

const router = express.Router();

console.log("🛠️ authRoutes dosyası çalışıyor!");

router.post("/register", register);
router.post("/login", login);
router.post("/external-login", externalLogin);

module.exports = router;
