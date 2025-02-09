const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");


// Harici API'den giriş yapma (Single Sign-On - SSO)
const externalLogin = async (req, res) => {
  try {
    const { externalToken } = req.body; // Harici API'den gelen token

    if (!externalToken) {
      return res.status(400).json({ message: "Harici token gereklidir." });
    }

    // Harici API'ye gidip kullanıcı bilgilerini alıyoruz
    const response = await axios.get("https://external-api.com/user", {
      headers: { Authorization: `Bearer ${externalToken}` }
    });

    const { name, email } = response.data;

    // Kullanıcı veritabanında kayıtlı mı kontrol et
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "", // Harici kullanıcılar için şifre saklamıyoruz
        role: "user" // Varsayılan olarak "user" olarak ekliyoruz
      });
    }

    // JWT token oluştur
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Harici kimlik doğrulama başarısız!" });
  }
};

// JWT Token Üretme
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Kayıt Ol (Register)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tüm alanlar zorunludur." });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Bu e-posta zaten kullanımda." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      token: generateToken(user),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Giriş Yap (Login)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "E-posta ve şifre zorunludur." });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Geçersiz e-posta veya şifre." });
    }

    res.status(200).json({
      token: generateToken(user),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, externalLogin };
