import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Define input validation schemas with Zod
const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please provide a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

// Configure Rate Limiter for Auth Routes
// Max 5 attempts per 15 minutes as per requirement
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again after 15 minutes.'
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper to generate a signed JWT token (7 days expiry)
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key-change-me';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

// 1. POST /api/auth/register - Create new user
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    // Validate request body
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map(err => err.message).join(' ');
      return res.status(400).json({ success: false, message: errorMsg });
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Registration failed. A user with this email address already exists.'
      });
    }

    // Hash password with bcrypt (12 salt rounds)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store user with hashed password (plain password is never stored or returned)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/auth/login - Validate credentials and return JWT
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    // Validate request body
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map(err => err.message).join(' ');
      return res.status(400).json({ success: false, message: errorMsg });
    }

    const { email, password } = validation.data;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Sign token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

// 3. GET /api/auth/me - Get current user profile
router.get('/me', requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

// 4. GET /api/auth/google - Trigger Google Authentication
router.get('/google', (req, res, next) => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (clientID && clientSecret && clientID !== 'dummy-client-id' && clientSecret !== 'dummy-client-secret') {
    // Perform standard Passport authentication
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  } else {
    // Redirect to mock consent page when credentials aren't configured
    res.redirect('/api/auth/google/mock-consent');
  }
});

// 5. GET /api/auth/google/mock-consent - Custom simulated Google Consent Screen
router.get('/google/mock-consent', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sign in with Google - Consent Screen</title>
  <style>
    body {
      margin: 0;
      font-family: 'Roboto', -apple-system, sans-serif;
      background-color: #f0f4f9;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: #1f1f1f;
    }
    .consent-card {
      background-color: #ffffff;
      border-radius: 28px;
      width: 450px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      box-sizing: border-box;
    }
    .google-logo {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }
    .title {
      font-size: 24px;
      font-weight: 400;
      text-align: center;
      margin-bottom: 8px;
    }
    .subtitle {
      font-size: 14px;
      color: #5f6368;
      text-align: center;
      margin-bottom: 30px;
    }
    .app-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background-color: #f8f9fa;
      border-radius: 12px;
      margin-bottom: 24px;
      border: 1px solid #dadce0;
    }
    .app-icon {
      background: linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%);
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    .app-details {
      flex-grow: 1;
    }
    .app-name {
      font-weight: 500;
      font-size: 14px;
    }
    .app-url {
      font-size: 12px;
      color: #5f6368;
    }
    .permissions-section {
      margin-bottom: 30px;
    }
    .permissions-title {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 12px;
      color: #3c4043;
    }
    .permission-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13px;
      color: #5f6368;
      margin-bottom: 10px;
      line-height: 1.4;
    }
    .permission-checkbox {
      color: #1a73e8;
      font-size: 16px;
      margin-top: 2px;
    }
    .divider {
      height: 1px;
      background-color: #dadce0;
      margin: 24px 0;
    }
    .user-select {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border: 1px solid #dadce0;
      border-radius: 100px;
      margin-bottom: 24px;
      cursor: pointer;
    }
    .user-avatar {
      width: 28px;
      height: 28px;
      background-color: #1a73e8;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 13px;
    }
    .user-email {
      font-size: 13px;
      font-weight: 500;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn {
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      padding: 10px 24px;
      border: none;
      border-radius: 100px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .btn-cancel {
      background-color: transparent;
      color: #1a73e8;
    }
    .btn-cancel:hover {
      background-color: #f8f9fa;
    }
    .btn-allow {
      background-color: #1a73e8;
      color: white;
    }
    .btn-allow:hover {
      background-color: #1557b0;
    }
  </style>
</head>
<body>
  <div class="consent-card">
    <div class="google-logo">
      <svg width="74" height="24" viewBox="0 0 74 24" fill="none">
        <path d="M7.74 15.35c-2.43 0-4.47-1.78-4.47-4.35 0-2.58 2.04-4.35 4.47-4.35 2.42 0 4.46 1.77 4.46 4.35 0 2.57-2.04 4.35-4.46 4.35zm0-10.38c-3.79 0-6.84 2.8-6.84 6.03s3.05 6.03 6.84 6.03 6.83-2.8 6.83-6.03-3.04-6.03-6.83-6.03z" fill="#EA4335"/>
        <path d="M22.86 15.35c-2.42 0-4.46-1.78-4.46-4.35 0-2.58 2.04-4.35 4.46-4.35 2.43 0 4.47 1.77 4.47 4.35 0 2.57-2.04 4.35-4.47 4.35zm0-10.38c-3.8 0-6.84 2.8-6.84 6.03s3.04 6.03 6.84 6.03c3.79 0 6.83-2.8 6.83-6.03s-3.04-6.03-6.83-6.03z" fill="#FBBC05"/>
        <path d="M37.52 15.35c-2.42 0-4.47-1.78-4.47-4.35s2.05-4.35 4.47-4.35c2.42 0 4.36 1.79 4.36 4.35s-1.94 4.35-4.36 4.35zm0-10.38c-3.69 0-6.79 2.82-6.79 6.03s3.1 6.03 6.79 6.03c2.46 0 4.2-1.07 5.15-2.22v1.73c0 2.3-1.22 3.53-3.2 3.53-1.63 0-2.63-1.18-3.05-2.18l-3.02 1.27c.88 2.12 3.2 4.9 6.07 4.9 3.52 0 5.98-2.09 5.98-6.27V5.37h-3.32v1.5c-.95-1.12-2.7-2.12-5.16-2.12z" fill="#4285F4"/>
        <path d="M49.63.45h3.48v22.8H49.63z" fill="#34A853"/>
        <path d="M60.67 15.35c-1.89 0-3.48-.95-4.14-2.41l9.36-3.88-.32-.82c-.67-1.8-2.66-4.92-6.52-4.92-3.83 0-6.86 3.02-6.86 6.03 0 3.2 3.01 6.03 6.86 6.03 3.1 0 4.9-1.91 5.65-3.02l-2.63-1.76c-.88 1.3-2.03 2.17-3.55 2.17zm-.26-10.15c1.48 0 2.74.77 3.16 1.86l-7.56 3.14c0-2.31 1.63-5 4.4-5z" fill="#EA4335"/>
        <path d="M69.06 6.03c-2.4 0-4.34-1.78-4.34-4.35 0-2.58 1.94-4.35 4.34-4.35 2.39 0 4.33 1.77 4.33 4.35 0 2.57-1.94 4.35-4.33 4.35zm0-10.38c-3.75 0-6.75 2.8-6.75 6.03s3 6.03 6.75 6.03c3.74 0 6.74-2.8 6.74-6.03s-3-6.03-6.74-6.03z" fill="#4285F4"/>
      </svg>
    </div>
    
    <h1 class="title">Choose an account</h1>
    <div class="subtitle">to continue to <strong>InsightStay AI</strong></div>
    
    <div class="user-select" onclick="document.getElementById('allow-btn').click();">
      <div class="user-avatar">G</div>
      <div class="user-details-row">
        <div class="user-email">guest.user@gmail.com</div>
        <div style="font-size: 11px; color: #5f6368">Google Account Profile</div>
      </div>
    </div>
    
    <div class="app-info">
      <div class="app-icon">IS</div>
      <div class="app-details">
        <div class="app-name">InsightStay AI</div>
        <div class="app-url">http://localhost:5173</div>
      </div>
    </div>
    
    <div class="permissions-section">
      <div class="permissions-title">Permissions requested:</div>
      <div class="permission-item">
        <span class="permission-checkbox">✓</span>
        <span>Read your basic profile (Name, Profile Picture)</span>
      </div>
      <div class="permission-item">
        <span class="permission-checkbox">✓</span>
        <span>View your email address (guest.user@gmail.com)</span>
      </div>
    </div>
    
    <div class="divider"></div>
    
    <div class="actions">
      <button class="btn btn-cancel" onclick="window.location.href='http://localhost:5173/login'">Cancel</button>
      <button id="allow-btn" class="btn btn-allow" onclick="window.location.href='/api/auth/google/callback?mock=true'">Allow</button>
    </div>
  </div>
</body>
</html>
  `);
});

// 6. GET /api/auth/google/callback - Handle OAuth callback redirection
router.get('/google/callback', (req, res, next) => {
  const isMock = req.query.mock === 'true';

  if (isMock) {
    // Execute simulated callback flow
    handleMockOAuth(req, res).catch(next);
  } else {
    // Real Passport Callback Flow
    passport.authenticate('google', { session: false }, (err, user) => {
      if (err || !user) {
        console.error('Real Google OAuth Callback Error:', err);
        return res.redirect('http://localhost:5173/login?error=oauth_failed');
      }
      
      const token = generateToken(user._id);
      res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
    })(req, res, next);
  }
});

// Helper for Mock OAuth flow
const handleMockOAuth = async (req, res) => {
  // Find or create the mock google user in database
  const email = 'guest.user@gmail.com';
  const name = 'Google Guest';
  const googleId = 'google-mock-id-12345';

  let user = await User.findOne({ $or: [{ googleId }, { email }] });
  if (user) {
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
  } else {
    user = await User.create({
      name,
      email,
      googleId,
      password: '', // OAuth users have no password
    });
  }

  // Generate JWT and redirect back to React App
  const token = generateToken(user._id);
  res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
};

// 7. GET /api/auth/logout - Perform log out
router.get('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully!'
  });
});

export default router;
