const User = require('../models/User');
const { generateTokens, setTokenCookie } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// ── Register ──────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, city, age } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, error: 'Email already registered' });

    const user = await User.create({
      name, email, password, phone,
      profile: { city, age: age ? parseInt(age) : undefined },
      role: 'customer',
    });

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    user.loginCount = 1;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    setTokenCookie(res, accessToken);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token: accessToken,
      user: user.toJSON(),
    });
  } catch (err) {
    console.error('[Register]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Login ─────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    if (!user.isActive) return res.status(403).json({ success: false, error: 'Account deactivated. Contact support.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save({ validateBeforeSave: false });

    setTokenCookie(res, accessToken);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token: accessToken,
      user: user.toJSON(),
    });
  } catch (err) {
    console.error('[Login]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Logout ────────────────────────────────────────────────────────
exports.logout = async (req, res) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    }
    res.clearCookie('accessToken');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get current user ──────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedHospitals', 'name city rating accreditations');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Update profile ────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['name','phone','profile'];
    const updates = {};
    for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Change password ───────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const match = await user.comparePassword(currentPassword);
    if (!match) return res.status(400).json({ success: false, error: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Save/unsave hospital ──────────────────────────────────────────
exports.toggleSaveHospital = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const hId  = req.params.hospitalId;
    const idx  = user.savedHospitals.indexOf(hId);
    let saved;
    if (idx === -1) { user.savedHospitals.push(hId); saved = true; }
    else            { user.savedHospitals.splice(idx, 1); saved = false; }
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, saved, message: saved ? 'Hospital saved' : 'Hospital unsaved' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Refresh token ─────────────────────────────────────────────────
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ success: false, error: 'Refresh token missing' });
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }
    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    setTokenCookie(res, accessToken);
    res.json({ success: true, token: accessToken });
  } catch (err) {
    res.status(401).json({ success: false, error: 'Token refresh failed' });
  }
};
