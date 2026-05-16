const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Verify JWT ────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check httpOnly cookie
  else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: 'User not found or deactivated.' });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Session expired. Please log in again.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, error: 'Invalid token.' });
  }
};

// ── Optional auth (doesn't fail if no token) ─────────────────────
const optionalAuth = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (_) { req.user = null; }
  }
  next();
};

// ── Role guard ────────────────────────────────────────────────────
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Not authenticated' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: `Access restricted to: ${roles.join(', ')}` });
  }
  next();
};

// Convenience guards
const adminOnly    = authorize('admin', 'superadmin');
const customerOnly = authorize('customer');

// ── Log admin actions ─────────────────────────────────────────────
const logAudit = (action, resource) => async (req, res, next) => {
  req._auditAction   = action;
  req._auditResource = resource;
  next();
};

// ── Generate tokens ────────────────────────────────────────────────
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
  return { accessToken, refreshToken };
};

// ── Set auth cookie ────────────────────────────────────────────────
const setTokenCookie = (res, accessToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure:   process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    maxAge:   7 * 24 * 60 * 60 * 1000,  // 7 days
  });
};

module.exports = { protect, optionalAuth, authorize, adminOnly, customerOnly, logAudit, generateTokens, setTokenCookie };
