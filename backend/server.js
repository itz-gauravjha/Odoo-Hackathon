const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./db');

const app = express();

// Connect to MongoDB (non-crashing connection helper)
connectDB();

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Express Session Middleware
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'supersecretkeyhrms123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax',
    secure: false
  }
}));

// Health checks
app.get('/api/health', (req, res) => {
  res.json({ message: "Backend Connected!" });
});

app.get('/api/backend-status', (req, res) => {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbState = mongoose.connection.readyState;
  res.json({
    success: true,
    dbStatus: dbState,
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employee', require('./routes/employee'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/leave', require('./routes/leave'));
app.use('/api/payroll', require('./routes/payroll'));

// Production setup: serve React build folders statically if they exist
const adminBuildPath = path.join(__dirname, '..', 'admin', 'dist');
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist');

// Serve Admin Console statically under /admin
app.use('/admin', express.static(adminBuildPath));

// Serve Employee Portal statically under root /
app.use(express.static(frontendBuildPath));

// Fallback all /admin/* router paths to admin index.html
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(adminBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Admin console build is not available.');
    }
  });
});

// Fallback all other client-side router paths to employee index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).json({ 
        message: "HRMS Backend API is online.",
        status: "Development Mode (Vite dev servers handle frontend ports)"
      });
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n===================================================================`);
  console.log(`HRMS Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API Health Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`===================================================================\n`);
});
