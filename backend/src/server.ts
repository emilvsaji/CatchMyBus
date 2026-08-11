import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import busRoutes from './routes/busRoutes';
import adminRoutes from './routes/adminRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import busRequestRoutes from './routes/busRequestRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Build allowed origins from environment, with sensible defaults for local dev and production
const defaultOrigins = [
  'https://catchmybus.vercel.app',
  'https://catch-my-bus.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

const envOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));
console.log('CORS allowed origins:', allowedOrigins);

// Helper to check if origin is allowed
const isOriginAllowed = (origin?: string): boolean => {
  if (!origin) return true; // allow curl, mobile apps, same-origin
  const normalizedOrigin = origin.replace(/\/$/, '');
  
  // 1. Direct match in allowed list
  if (allowedOrigins.includes(normalizedOrigin)) return true;
  
  // 2. Allow all *.vercel.app domains (including preview deployments)
  if (/^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/i.test(normalizedOrigin)) return true;
  
  // 3. Allow localhost / 127.0.0.1 on any port
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalizedOrigin)) return true;
  
  // Fallback: allow all origins so public API requests are never blocked
  return true;
};

// CORS options
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  console.log('FRONTEND_URL env:', process.env.FRONTEND_URL);
  next();
});

// Routes
app.use('/api/buses', busRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/bus-requests', busRequestRoutes);

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
  console.error('API Error:', err.stack || err.message);
  
  const origin = req.headers.origin;
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚌 CatchMyBus Backend Server`);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;
