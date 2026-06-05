import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { env } from './config/env.js';
import { loggerStream } from './utils/logger.js';
import todoRoutes from './routes/todoRoutes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. CORS configuration
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// 3. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: env.NODE_ENV === 'production' ? 100 : 1000, // request thresholds
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', limiter);

// 4. Request Compression
app.use(compression());

// 5. Request logging
app.use(
  morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: loggerStream,
  })
);

// 6. JSON & URL Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 7. Health Check Route
app.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// 8. Bind API Routes
app.use('/api/todos', todoRoutes);

// 9. Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
