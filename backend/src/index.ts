import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import emotionRoutes from './routes/emotion.routes';
import journalRoutes from './routes/journal.routes';
import streakRoutes from './routes/streak.routes';
import recommendationRoutes from './routes/recommendation.routes';
import goalRoutes from './routes/goal.routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Mental Wellness Tracker API is running' });
});

// API routes
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Mental Wellness Tracker API v1.0' });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Emotion routes
app.use('/api/emotions', emotionRoutes);

// Journal routes
app.use('/api/journals', journalRoutes);

// Streak routes
app.use('/api/streaks', streakRoutes);

// Recommendation routes
app.use('/api/recommendations', recommendationRoutes);

// Goal routes
app.use('/api/goals', goalRoutes);

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
