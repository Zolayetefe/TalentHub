import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from "./routes/applicationRoutes.js";

const app = express();


app.use(cookieParser());
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);
app.use("/applications", applicationRoutes);
export default app;
