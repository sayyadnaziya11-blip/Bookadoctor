const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Controller
const registerController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(200).send({
        message: 'User already exists with this email',
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isAdmin = role === 'admin' || role === 'Admin';

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin,
    });

    await newUser.save();

    res.status(201).send({
      message: 'Registration successful! Please login to continue.',
      success: true,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).send({
      success: false,
      message: `Error in Register Controller: ${error.message}`,
    });
  }
};

// Login Controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(200).send({
        message: 'User not found with this email',
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).send({
        message: 'Invalid Email or Password',
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'medicare_secret_jwt_key_2026_super_secure',
      { expiresIn: '7d' }
    );

    res.status(200).send({
      message: 'Login successful',
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isDoctor: user.isDoctor,
        unseenNotifications: user.unseenNotifications,
        seenNotifications: user.seenNotifications,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({
      message: `Error in Login Controller: ${error.message}`,
      success: false,
    });
  }
};

// Auth / Get current user info controller
const getUserInfoController = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(200).send({
        message: 'User does not exist',
        success: false,
      });
    }
    user.password = undefined;
    res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).send({
      message: 'Auth Error: ' + error.message,
      success: false,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  getUserInfoController,
};
