import UserModel from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Utility function for cookie configuration
const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days in milliseconds
};

// Utility function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '5d' }
  );
};

// User registration controller
const userRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name,email,password);

    // Input validation
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        status: 'failed',
        message: 'All fields are required and cannot be empty'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'failed',
        message: 'Invalid email format'
      });
    }

    // Check for existing user
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        status: 'failed',
        message: 'Email already registered'
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        status: 'failed',
        message: 'Password must be at least 8 characters long'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new UserModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashPassword,
    });

    const savedUser = await newUser.save();

    // Generate token
    const token = generateToken(savedUser._id);

    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    // Set cookie
    res.cookie('token', token);

    return res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Internal server error during registration'
    });
  }
};

// User login controller
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        status: 'failed',
        message: 'Email and password are required'
      });
    }

    // Find user and select specific fields
    const user = await UserModel.findOne({ email: email.toLowerCase() })
      .select('+password')
      .lean();

    if (!user) {
      return res.status(401).json({
        status: 'failed',
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'failed',
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    delete user.password;

    // Set cookie
    res.cookie('token', token, cookieConfig);

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      user
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Internal server error during login'
    });
  }
};

// Get user by ID controller
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'failed',
        message: 'Invalid user ID format'
      });
    }

    const user = await UserModel.findById(id)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        message: 'User not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      user
    });

  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Internal server error while fetching user'
    });
  }
};

// Logout controller
const logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({
    status: 'success',
    message: 'Logout successful'
  });
};

export { userRegistration, userLogin, getUserById, logout };