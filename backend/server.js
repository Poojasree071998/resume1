
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const analyzeRoute = require('./routes/analyze');
const matchRoute = require('./routes/match');
const candidateRoute = require('./routes/candidates');
const interviewRoute = require('./routes/interviews');

const app = express();
const port = 5000;

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('Connected to MongoDB ✅'))
        .catch(err => console.error('MongoDB connection error ❌:', err));
} else {
    console.warn('MONGODB_URI not found in .env. Skipping DB connection.');
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analyze', analyzeRoute);
app.use('/api/match', matchRoute);
app.use('/api/candidates', candidateRoute);
app.use('/api/interviews', interviewRoute);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
