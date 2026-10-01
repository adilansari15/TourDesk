import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

dotenv.config();

// Verify JWT_SECRET is configured
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is missing.');
  process.exit(1);
}

// Connect to MongoDB Atlas
try {
  await connectDB();
} catch (error) {
  console.error('Failed to connect to MongoDB Atlas. Exiting process.');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
