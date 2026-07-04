const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./db');

const app = express();

// Trust Render's reverse proxy so secure cookies work on HTTPS
app.set('trust proxy', 1);

// Connect to MongoDB (non-crashing connection helper)
connectDB();

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const MongoStore = require('connect-mongo');

let mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrms';
if (mongoURI.includes('mongodb+srv') && !mongoURI.match(/\.net\/[a-zA-Z0-9]/)) {
  mongoURI = mongoURI.replace(/\.net\/?\?/, '.net/hrms?').replace(/\.net\/?$/, '.net/hrms');
}

// Express Session Middleware with MongoDB persistence store
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'supersecretkeyhrms123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoURI,
    collectionName: 'sessions',
    ttl: 7 * 24 * 60 * 60 // 7 days
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax', // Lax is highly robust and avoids third-party blocking in Chrome
    secure: process.env.NODE_ENV === 'production'
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

// Production setup: serve React build folder statically if it exists
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist');

// Serve Employee & Admin Portal statically under root /
app.use(express.static(frontendBuildPath));

// Fallback all client-side router paths to frontend index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).json({ 
        message: "HRMS Backend API is online.",
        status: "Development Mode (Vite dev server handles client ports)"
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
