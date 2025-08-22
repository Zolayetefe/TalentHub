// backend/src/utils/adminSetup.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const createInitialAdmin = async () => {
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) return;

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await User.create({
    name: process.env.ADMIN_NAME || 'Super Admin',
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    role: 'admin'
  });

  console.log('Initial admin account created!');
};

export default createInitialAdmin;
