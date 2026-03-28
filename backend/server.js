const express = require('express');
const cors = require('cors');
const analyzeRoute = require('./routes/analyze');
const matchRoute = require('./routes/match');
const candidateRoute = require('./routes/candidates');
const interviewRoute = require('./routes/interviews');

const app = express();
const port = 5000;

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
