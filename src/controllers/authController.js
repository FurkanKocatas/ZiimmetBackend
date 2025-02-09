const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");


// Harici API'den giriş yapma (Single Sign-On - SSO)
const externalLogin = async (req, res) => {
  try {
    const { name, email, externalId } = req.body;

    if (!email || !name || !externalId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        name,
        email,
        externalId,
        role: 'user',
        approved: true // Auto-approve external users
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    console.log('👉 Login attempt received:', req.body);

    const { email, name } = req.body;

    // Validate input
    if (!email || !name) {
      console.log('❌ Missing email or name');
      return res.status(400).json({ message: 'Please provide email and name' });
    }

    // Find user by email and name
    console.log('🔍 Searching for user:', { email, name });
    const user = await User.findOne({ email, name });
    console.log('User found:', user ? '✅ Yes' : '❌ No');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    console.log('🔑 Creating token for user:', user._id);
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Send response
    const response = {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
    console.log('✅ Login successful, sending response');
    res.json(response);

  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { register, login, externalLogin };
