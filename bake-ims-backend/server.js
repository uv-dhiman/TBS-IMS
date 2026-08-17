const dns = require('dns');
// Set standard Google and Cloudflare DNS servers for reliable Atlas SRV resolution
dns.setServers(['1.1.1.1', '8.8.8.8']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middlewares
 // Robust CORS setup for Vercel + OPTIONS preflight handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(cors());
// MongoDB User Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'staff' },
  isPasswordSet: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// MongoDB Atlas Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin_ims:BakeIms2026@cluster0.u2x5ska.mongodb.net/bakeIMS?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log(' MongoDB Connected Successfully'))
  .catch(err => console.error(' MongoDB Connection Error:', err));

// 1. Root Test Route
app.get('/', (req, res) => {
  res.json({ message: 'TBS IMS Backend is Running Live!' });
});

// 2. Setup/Reset Admin Endpoint
app.get('/api/setup-admin', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    // Delete existing entry to avoid collision
    await User.deleteMany({ email: 'admin@thebakingschool.com' });

    const newAdmin = new User({
      name: 'Super Admin',
      email: 'admin@thebakingschool.com',
      password: hashedPassword,
      role: 'staff',
      isPasswordSet: true,
      isActive: true
    });

    await newAdmin.save();

    res.json({
      success: true,
      message: 'Admin account created successfully!',
      credentials: {
        role: 'staff',
        email: 'admin@thebakingschool.com',
        password: 'Admin@123'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Robust Login Route (Supports both /api/login and /api/auth/login)
const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'thebakingschoolsecretkey123',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login', error: err.message });
  }
};

app.post('/api/auth/login', handleLogin);
app.post('/api/login', handleLogin);

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});