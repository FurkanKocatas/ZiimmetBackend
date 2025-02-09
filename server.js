const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection Options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  autoIndex: true,
  connectTimeoutMS: 10000,
};

// Connect to MongoDB
async function connectDB() {
  try {
    console.log('🔄 Attempting MongoDB connection...');
    await mongoose.connect('mongodb://127.0.0.1:27017/zimmet', mongoOptions);
    console.log('✅ MongoDB Connected Successfully');
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    return false;
  }
}

// Start Server Function
async function startServer() {
  // Try to connect to MongoDB
  const isConnected = await connectDB();
  if (!isConnected) {
    console.error('❌ Failed to connect to MongoDB. Exiting...');
    process.exit(1);
  }

  // Import routes
  const authRoutes = require('./src/routes/authRoutes');
  const userRoutes = require('./src/routes/userRoutes');
  const adminRoutes = require('./src/routes/adminRoutes');
  const deviceRoutes = require('./src/routes/deviceRoutes');

  // Use routes
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/devices', deviceRoutes);

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({ 
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Handle process errors
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// Start the server
startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});