const express = require('express');
const cors = require('cors');
const multer = require('multer');

// Import utilities from backend
const { extractTextFromPDF, extractTextFromDOCX } = require('../backend/utils/pdfParser');
const { parseResumeContent, analyzeResume, optimizeResume, generateCareerRoadmap, roleKeywords } = require('../backend/utils/aiPrompt');
const candidateController = require('../backend/controllers/candidateController');

const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 }, storage });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running (serverless)' });
});

// Resume Analysis
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    const file = req.file;
    const role = req.body.role || 'General';
    const jd = req.body.jd || '';

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    let text = '';
    if (file.mimetype === 'application/pdf') {
      text = await extractTextFromPDF(file.buffer);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      text = await extractTextFromDOCX(file.buffer);
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    const parsedData = parseResumeContent(text);
    const analysisResults = analyzeResume(parsedData, role, jd);

    if (!text || text.trim().length === 0) {
      return res.json({
        ...analysisResults, status: 'error',
        name: file.originalname.split('.')[0], score: 0, matchPercentage: 0,
        verdict: 'Rejected',
        reasons: ['Unreadable PDF: The file seems to be an image-based or has no text.'],
        remarks: 'Resume text extraction failed.', role, extractedText: ''
      });
    }

    res.json({ ...analysisResults, role, extractedText: text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze resume', details: error.message });
  }
});

// Optimization
app.post('/api/analyze/optimize', async (req, res) => {
  try {
    const { analysis, role, jd } = req.body;
    if (!analysis) return res.status(400).json({ error: 'Missing analysis data' });
    const optimization = optimizeResume(analysis, role, jd);
    const roadmap = generateCareerRoadmap(analysis, role);
    res.json({ ...optimization, roadmap });
  } catch (error) {
    res.status(500).json({ error: 'Failed to optimize resume', details: error.message });
  }
});

// Job Matcher
app.post('/api/match', (req, res) => {
  const { resumeText, jobDescription } = req.body;
  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'Missing resume text or job description' });
  }

  let detectedRole = 'General';
  const jdLower = jobDescription.toLowerCase();
  if (jdLower.includes('frontend') || jdLower.includes('react') || jdLower.includes('ui')) detectedRole = 'Frontend';
  else if (jdLower.includes('backend') || jdLower.includes('node') || jdLower.includes('server')) detectedRole = 'Backend';
  else if (jdLower.includes('fullstack') || jdLower.includes('full stack')) detectedRole = 'Fullstack';
  else if (jdLower.includes('sales') || jdLower.includes('business development') || jdLower.includes('bda') || jdLower.includes('bdm')) detectedRole = 'Sales';

  const keywords = roleKeywords[detectedRole] || roleKeywords['General'];
  const matchingSkills = keywords.filter(k => new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(resumeText));
  const missingSkills = keywords.filter(k => !matchingSkills.includes(k));
  const percentage = Math.round((matchingSkills.length / keywords.length) * 100);
  const finalPercentage = Math.min(98, Math.max(5, percentage + (Math.floor(Math.random() * 10) - 5)));

  let recommendation = '';
  if (finalPercentage > 80) recommendation = `Excellent alignment! Your profile shows a ${finalPercentage}% match for ${detectedRole}.`;
  else if (finalPercentage > 50) recommendation = `Good potential for ${detectedRole}, but improve on ${missingSkills.slice(0, 2).join(' and ')}.`;
  else recommendation = `Lower alignment (${finalPercentage}%). Focus on developing ${detectedRole} skills.`;

  res.json({ percentage: finalPercentage, matchingSkills: matchingSkills.length > 0 ? matchingSkills : ['Communication', 'Agile'], missingSkills: missingSkills.slice(0, 4), recommendation });
});

// Interview Questions
app.post('/api/interview', (req, res) => {
  res.json([
    { type: 'Technical', title: 'State Management', question: 'How would you handle global state in a multi-tenant dashboard?' },
    { type: 'Technical', title: 'Optimization', question: 'Explain your strategy for reducing Time to Interactive (TTI) in a heavy data visualization dashboard.' },
    { type: 'HR', title: 'Team Culture', question: 'Tell me about a time you mentored a junior developer during a critical sprint.' },
    { type: 'Project', title: 'Security', question: 'How did you handle token refresh and XSS prevention with JWT auth?' }
  ]);
});

// Candidate Routes
app.get('/api/candidates', candidateController.getCandidates);
app.post('/api/candidates', candidateController.addCandidate);
app.patch('/api/candidates/:id', candidateController.updateCandidate);
app.delete('/api/candidates/:id', candidateController.deleteCandidate);
app.post('/api/candidates/rank', candidateController.rankCandidates);

// Interview Token Routes
app.post('/api/interviews/generate', (req, res) => {
  const { userRole } = req.body;
  if (userRole !== 'HR') return res.status(403).json({ error: 'Only HR can generate interview links' });
  candidateController.generateInterviewToken(req, res);
});
app.get('/api/interviews/validate/:token', candidateController.validateToken);

module.exports = app;
