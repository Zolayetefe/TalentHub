import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';
import createInitialAdmin from './utils/adminSetup.js';


// Load environment variables
dotenv.config();


// Connect to MongoDB
connectDB().then(createInitialAdmin);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

