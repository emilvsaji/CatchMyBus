import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import busRoutes from './routes/busRoutes';
import adminRoutes from './routes/adminRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import feedbackRoutes from './routes/feedbackRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/buses', busRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'CatchMyBus API is running' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚌 CatchMyBus Backend Server`);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;
