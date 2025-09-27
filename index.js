import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectToDB from './config/db.js';

// import routes
import userRoutes from './routes/user.js';
import incomeRoutes from './routes/income.js';
import expenseRoutes from './routes/expense.js';

// load environment variables
dotenv.config();
const PORT = process.env.PORT || 5002;

// connect to database
connectToDB();

// initialize express
const app = express();

// enable CORS for frontend
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use('/api', userRoutes);
app.use('/api', incomeRoutes);
app.use('/api', expenseRoutes);

// handle 404
app.use('*', (req, res) => {
    res.status(404).json({ message: '404 - Not Found' });
});

// handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || '500 - Internal Server Error' });
});

// start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
