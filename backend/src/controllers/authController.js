
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

    res.status(201).json({
      token: generateToken(user._id),
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
    console.log('user', user);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    console.log('isMatch', isMatch);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.cookie('token', generateToken(user._id), {
      httpOnly: true,           // Prevent JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict',       // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
