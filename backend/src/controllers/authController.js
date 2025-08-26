
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// register user
// Register user (only applicant and employer)
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Allow only applicant or employer roles
    const allowedRoles = ['applicant', 'employer'];
    const userRole = allowedRoles.includes(role) ? role : 'applicant'; // fallback to applicant

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with validated role
    user = await User.create({ name, email, password, role: userRole });

    res.cookie('token', generateToken(user._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    }).status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
 
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);

    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.cookie('token', generateToken(user._id), {
      httpOnly: true,           // Prevent JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict',       // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }).json({
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
        
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current authenticated user
export const getMe = async (req, res) => {
  try {
    // Make sure req.user exists (set by your auth middleware)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Find user by _id
    const user = await User.findById(req.user._id).select('-password'); // exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



//logout user
export const logoutUser = async (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully' });
};