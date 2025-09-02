import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from "./routes/applicationRoutes.js";


const app = express();



app.use(cookieParser());
app.use(cors({
 
    origin: ['https://talent-hub-weld.vercel.app','http://localhost:5000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE', 'OPTIONS'],
    credentials: true
  }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use("/api/applications", applicationRoutes);
export default app;
