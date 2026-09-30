const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/User');
const Doctor = require('./models/Doctor');

// Config dotenv
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static folder for uploaded medical documents
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to Book a Doctor (MediCareBook) API Server' });
});

// Auto Seed Admin & Sample Doctors if DB is empty
const seedInitialData = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@medicare.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);
      await User.create({
        name: 'Hi..Admin',
        email: 'admin@medicare.com',
        password: hashedPassword,
        isAdmin: true,
        seenNotifications: [],
        unseenNotifications: [],
      });
      console.log('Seeded default admin user: admin@medicare.com / Admin@123');
    }

    // Seed Sample Doctors from reference if no doctors exist
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const pass = await bcrypt.hash('Doctor@123', salt);

      const doc1User = await User.create({
        name: 'Dr. Koushick',
        email: 'k@gmail.com',
        password: pass,
        isDoctor: true,
        seenNotifications: [],
        unseenNotifications: [],
      });

      const doc2User = await User.create({
        name: 'Dr. SHIVA',
        email: 'user@gamil.com',
        password: pass,
        isDoctor: true,
        seenNotifications: [],
        unseenNotifications: [],
      });

      const doc3User = await User.create({
        name: 'Dr. Karthick',
        email: 'ka@gmail.com',
        password: pass,
        isDoctor: true,
        seenNotifications: [],
        unseenNotifications: [],
      });

      await Doctor.create([
        {
          userId: doc1User._id,
          name: 'Dr. Koushick',
          email: 'k@gmail.com',
          phone: '09176478438',
          address: 'chennai',
          specialization: 'ENT',
          experience: '5 Yrs',
          fees: 1000,
          timings: ['07:00', '12:00'],
          status: 'approved',
        },
        {
          userId: doc2User._id,
          name: 'Dr. SHIVA',
          email: 'user@gamil.com',
          phone: '91755584121',
          address: 'chennnai',
          specialization: 'Blood',
          experience: '2 Yrs',
          fees: 5001,
          timings: ['06:00', '12:00'],
          status: 'approved',
        },
        {
          userId: doc3User._id,
          name: 'Dr. Karthick',
          email: 'ka@gmail.com',
          phone: '09176478438',
          address: 'chennai',
          specialization: 'Cardiology',
          experience: '7 Yrs',
          fees: 1500,
          timings: ['09:00', '16:00'],
          status: 'pending',
        },
      ]);
      console.log('Seeded sample doctors matching reference design.');
    }
  } catch (error) {
    console.warn('Seeding notice:', error.message);
  }
};

// Seed on startup when connected to MongoDB
mongoose.connection.once('open', () => {
  seedInitialData();
});

// Also seed immediately for file-based fallback mode (no MongoDB)
// Use a short delay so the server starts first
setTimeout(() => {
  if (mongoose.connection.readyState !== 1) {
    seedInitialData();
  }
}, 1500);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
