import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';

// import db connection
import connectToDB from './config/db.js';

// import middlewares
import logger from './middleware/logger.js';

// import routes
import userRoutes from './routes/user.js';
import incomeRoutes from './routes/income.js';
import expenseRoutes from './routes/expense.js';

// load environment variables
dotenv.config();
const PORT = process.env.PORT || 5003;

// construct the path
const __filename = fileURLToPath(import.meta.url);
const PATH = dirname(__filename);

// connect to database
connectToDB();

// initialize express
const app = express();

// CORS setup
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'https://expenses-tracker-2m0j.onrender.com'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// parses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only
    httpOnly: true,
    sameSite: 'none', // important for cross-origin
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// serve static files if needed
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(PATH, 'dist')));
}

// use middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(logger);
}

// use routes
app.use('/', userRoutes);
app.use('/', incomeRoutes);
app.use('/', expenseRoutes);

// serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(PATH, 'dist', 'index.html'));
  });
}

// handle 404
app.use('*', (req, res) => {
  res.status(404).json({ message: '404 - Not Found' });
});

// handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '500 - Internal Server Error' });
});

// listen to port
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
