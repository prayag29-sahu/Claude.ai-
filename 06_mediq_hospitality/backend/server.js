require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const morgan      = require('morgan');
const helmet      = require('helmet');
const rateLimit   = require('express-rate-limit');
const cookieParser= require('cookie-parser');
const connectDB   = require('./config/db');

const { authRouter, hospitalRouter, costRouter, chatRouter,
        procRouter, adminRouter, analyticsRouter } = require('./routes/index');

const app = express();

// ── Connect DB ────────────────────────────────────────────────────
connectDB();

// ── Core middleware ───────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin:      [process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true,
  methods:     ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// ── Rate limiting ─────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX) || 300,
  message:  { success: false, error: 'Too many requests — please try again later.' },
  skip: (req) => req.path === '/api/health',
});
app.use('/api/', limiter);

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/auth',       authRouter);
app.use('/api/hospitals',  hospitalRouter);
app.use('/api/costs',      costRouter);
app.use('/api/chat',       chatRouter);
app.use('/api/procedures', procRouter);
app.use('/api/admin',      adminRouter);
app.use('/api/analytics',  analyticsRouter);

// ── Health check ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok', version: '2.0.0',
    product: 'MedIQ Pro – Healthcare Decision Intelligence',
    dataSource: 'PM-JAY HBP 2.2 · NABH · CGHS Rate Zones',
    timestamp: new Date().toISOString(),
    db: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ── 404 ───────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, error: `Route not found: ${req.originalUrl}` }));

// ── Global error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── Start ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ MedIQ Pro Backend → http://localhost:${PORT}`);
  console.log(`📊 Data: PM-JAY HBP 2.2 · NABH · CGHS zones`);
  console.log(`🔒 Auth: JWT + HttpOnly cookies + RBAC\n`);
});

module.exports = app;
