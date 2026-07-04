const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const isPasswordSecure = (password) => {
  return password.length >= 6 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
};

const generateLoginId = async (name, companyName) => {
  const coPrefix = companyName && companyName.trim().length >= 2 
    ? companyName.trim().substring(0, 2).toUpperCase() 
    : 'OI';

  const nameParts = name.trim().split(/\s+/);
  let nameCode = '';
  if (nameParts.length >= 2) {
    const first = nameParts[0].substring(0, 2).toUpperCase();
    const last = nameParts[nameParts.length - 1].substring(0, 2).toUpperCase();
    nameCode = first + last;
  } else if (nameParts.length === 1) {
    const word = nameParts[0];
    if (word.length >= 4) {
      nameCode = word.substring(0, 4).toUpperCase();
    } else {
      nameCode = (word + 'XXXX').substring(0, 4).toUpperCase();
    }
  } else {
    nameCode = 'XXXX';
  }

  const currentYear = new Date().getFullYear().toString();
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

  const count = await User.countDocuments({
    joiningDate: { $gte: startOfYear, $lte: endOfYear }
  });

  let loginId = '';
  let isUnique = false;
  let increment = 0;
  while (!isUnique) {
    const serial = String(count + 1 + increment).padStart(4, '0');
    loginId = `${coPrefix}${nameCode}${currentYear}${serial}`;
    const existing = await User.findOne({ loginId });
    if (!existing) {
      isUnique = true;
    } else {
      increment++;
    }
  }
  return loginId;
};

// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, companyName, companyLogo } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    if (!isPasswordSecure(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long and contain both letters and numbers' 
      });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const loginId = await generateLoginId(name, companyName);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a 6-digit verification OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      loginId,
      name,
      email,
      password: hashedPassword,
      role,
      companyName: companyName || '',
      companyLogo: companyLogo || '',
      employeeId: loginId, // back-compat placeholder
      isVerified: false,
      verificationToken: otp
    });

    await newUser.save();

    let emailSent = false;
    try {
      const mailOptions = {
        from: `"HRMS Portal" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your HRMS Account - OTP Code',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
            <h2 style="color: #6366f1; text-align: center;">HRMS Verification Code</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Thank you for registering at the HRMS Portal. Please use the following One-Time Password (OTP) to verify your account registration:</p>
            <div style="background-color: #e0e7ff; border: 1px dashed #6366f1; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0;">
              <span style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #4f46e5;">${otp}</span>
            </div>
            <p>Or, click the button below to verify automatically:</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="http://127.0.0.1:3000/api/auth/verify?token=${otp}" style="background-color: #6366f1; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Verify Email Address</a>
            </div>
            <p style="font-size: 11px; color: #64748b; text-align: center; margin-top: 20px;">This OTP will expire shortly. If you did not request this, please ignore this email.</p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
      emailSent = true;
      console.log(`[SMTP] Verification email sent successfully to ${email}`);
    } catch (mailErr) {
      console.error('[SMTP] Failed to send verification email:', mailErr);
    }

    const verifyLink = `http://127.0.0.1:3000/api/auth/verify?token=${otp}`;
    console.log('\n======================================================');
    console.log(`NEW USER SIGNUP: ${name} (${role})`);
    console.log(`GENERATED LOGIN ID: ${loginId}`);
    console.log(`OTP CODE: ${otp}`);
    console.log(`VERIFICATION LINK: ${verifyLink}`);
    console.log('======================================================\n');

    res.status(201).json({ 
      success: true, 
      message: emailSent
        ? `Registration successful! Verification OTP code has been sent to ${email}.`
        : `Registration successful! OTP code: ${otp} (SMTP offline).`,
      loginId,
      otpDevOnly: otp,
      verificationLinkDevOnly: verifyLink
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// @route   GET /api/auth/verify
router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send('<h1>Error</h1><p>Verification token is missing.</p>');
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).send('<h1>Error</h1><p>Invalid or expired verification token.</p>');
    }

    user.isVerified = true;
    user.verificationToken = '';
    await user.save();

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email Verified Successfully</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap" rel="stylesheet">
        <style>
          body {
            background: #0f172a;
            color: #f8fafc;
            font-family: 'Outfit', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .card {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 3rem;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            max-width: 400px;
          }
          h1 { color: #818cf8; margin-bottom: 1rem; }
          p { color: #94a3b8; font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; }
          .btn {
            background: linear-gradient(135deg, #6366f1, #4f46e5);
            color: white;
            padding: 0.8rem 2rem;
            border: none;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Verification Successful!</h1>
          <p>Your HRMS account has been successfully verified. You can now close this tab or return to the application to sign in.</p>
          <a href="http://localhost:5173/" class="btn">Proceed to Login</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).send('<h1>Server Error</h1><p>An error occurred during verification.</p>');
  }
});

// @route   POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP code are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verificationToken !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    user.isVerified = true;
    user.verificationToken = '';
    await user.save();

    res.json({ success: true, message: 'Account verified successfully!' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
});

// @route   POST /api/auth/signin
router.post('/signin', async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ message: 'Please provide Login ID and password' });
    }

    const user = await User.findOne({ 
      $or: [
        { loginId: loginId },
        { email: loginId.toLowerCase() }
      ]
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ 
        message: 'Account not verified. Please check server console for verification link.',
        notVerified: true 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    req.session.role = user.role;

    res.json({
      success: true,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/status
router.get('/status', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ isAuthenticated: false });
    }

    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      req.session.destroy();
      return res.json({ isAuthenticated: false });
    }

    res.json({
      isAuthenticated: true,
      user
    });
  } catch (error) {
    console.error('Session status error:', error);
    res.status(500).json({ message: 'Server error check status' });
  }
});

// @route   POST /api/auth/signout
router.post('/signout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('sid');
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;
