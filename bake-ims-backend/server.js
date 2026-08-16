const dns = require('dns');
// Custom DNS Resolver for MongoDB Atlas connectivity
dns.setServers(['1.1.1.1', '8.8.8.8']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Student = require('./models/Student');

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB Cloud Database Connected!'))
  .catch((err) => console.error(' MongoDB Connection Error:', err));

// ================= AUTH ROUTES =================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'staff'
    });

    await user.save();
    res.json({ success: true, message: 'Account Created Successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'User account nahi mila!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Galat Password!' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================= STUDENT ADMISSION ROUTES =================

// 1. Create New Student Admission
app.post('/api/students', async (req, res) => {
  try {
    const { name, email, phone, course, totalFee, paidFee } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Student with this email already exists' });
    }

    const newStudent = new Student({
      name,
      email,
      phone,
      course,
      totalFee: Number(totalFee),
      paidFee: Number(paidFee || 0)
    });

    await newStudent.save();
    res.status(201).json({ success: true, student: newStudent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Fetch All Enrolled Students & Summary Stats
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ admissionDate: -1 });

    const totalStudents = students.length;
    const totalFeesCollected = students.reduce((acc, curr) => acc + (curr.paidFee || 0), 0);
    const totalFeeTarget = students.reduce((acc, curr) => acc + (curr.totalFee || 0), 0);
    const pendingDues = totalFeeTarget - totalFeesCollected;

    res.json({
      success: true,
      students,
      stats: {
        totalStudents,
        totalFeesCollected,
        pendingDues
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Update Student Paid Fee
app.put('/api/students/:id/fee', async (req, res) => {
  try {
    const { additionalAmount } = req.body;
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    student.paidFee = Number(student.paidFee || 0) + Number(additionalAmount || 0);
    await student.save();

    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));