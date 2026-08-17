const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// CORS Bypass
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(cors({ origin: '*' }));
app.use(express.json());

// Models (Existing files import)
const User = require('./models/User');
const Student = require('./models/Student');
const Inventory = require('./models/Inventory');

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin_ims:BakeIms2026@cluster0.u2x5ska.mongodb.net/bakeIMS?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Error:', err));

// 1. Health Route
app.get('/', (req, res) => res.json({ message: 'TBS IMS Live' }));

// 2. Auth / Login Route
const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'thebakingschoolsecretkey123',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server login error', error: err.message });
  }
};
app.post('/api/auth/login', handleLogin);
app.post('/api/login', handleLogin);

// 3. Student Routes
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { name, email, phone, course, totalFee, initialPaidAmount, paidFee } = req.body;
    const total = Number(totalFee) || 0;
    const paid = Number(initialPaidAmount || paidFee) || 0;

    const newStudent = new Student({
      name,
      email,
      phone,
      course,
      totalFee: total,
      paidFee: paid,
      dueFee: total - paid
    });

    const saved = await newStudent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting admission', error: err.message });
  }
});

app.put('/api/students/:id/fee', async (req, res) => {
  try {
    const { additionalAmount } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.paidFee = (student.paidFee || 0) + Number(additionalAmount);
    student.dueFee = (student.totalFee || 0) - student.paidFee;
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));