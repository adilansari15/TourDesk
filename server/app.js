import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser Middleware
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiryRoutes);

export default app;
