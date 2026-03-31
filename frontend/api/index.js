import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mammoth from 'mammoth';
import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// --- CONFIGURATION ---
const BREVO_API_KEY = process.env.BREVO_API_KEY || 'your_brevo_api_key_here';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const DB_PATH = path.join('/tmp', 'database.json');

let inMemoryDB = { candidates: [] };

// --- UTILS: PDF & DOCX ---
const extractTextFromPDF = async (buffer) => {
    try {
        if (!buffer || buffer.length === 0) return "";
        const data = await pdfParse(buffer);
        return data.text || "";
    } catch (error) {
        console.error('Error parsing PDF:', error);
        return "";
    }
};

const extractTextFromDOCX = async (buffer) => {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        console.error('Error parsing DOCX:', error);
        return "";
    }
};

// --- UTILS: AI PROMPTS & ANALYSIS ---
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const roleKeywords = {
    'Frontend': ['React', 'JavaScript', 'TypeScript', 'Tailwind', 'Next.js', 'Redux', 'Architecture', 'TTI', 'Core Web Vitals', 'Performant', 'Accessible'],
    'Backend': ['Node.js', 'Go', 'Python', 'Microservices', 'distributed systems', 'high-availability', 'concurrency', 'API engineering', 'PostgreSQL', 'Kubernetes'],
    'Fullstack': ['React', 'Next.js', 'TypeScript', 'Node.js', 'tRPC', 'Prisma', 'E2E testing', 'SaaS', 'System Design'],
    'BDA': ['Data', 'Analytics', 'SQL', 'Tableau', 'Power BI'],
    'Sales': ['Revenue', 'Market Expansion', 'CRM', 'Lead Generation', 'B2B', 'GTM'],
    'General': ['Git', 'Communication', 'Teamwork', 'Agile', 'Leadership']
};

const extractKeywordsFromJD = (jdText) => {
    if (!jdText) return [];
    const techLibrary = ['React', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'PostgreSQL', 'Redux', 'Express', 'Tailwind', 'Next.js', 'Vue', 'Angular', 'DevOps', 'CI/CD', 'Agile', 'UI/UX', 'Figma'];
    return techLibrary.filter(k => new RegExp(`\\b${escapeRegExp(k)}\\b`, 'i').test(jdText));
};

const extractPersonalDetails = (text = "") => {
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const detectedName = lines.length > 0 ? lines[0] : "CANDIDATE NAME";
    return {
        name: String(detectedName).toUpperCase(),
        email: emailMatch ? emailMatch[0] : "contact@email.com",
        phone: phoneMatch ? phoneMatch[0] : "+91 91234 56789",
        location: "Detected from Resume",
        dob: "DD-MM-YYYY",
        gender: "Not Specified",
        nationality: "Indian",
        education: "Bachelor's Degree",
        institution: "Professional University"
    };
};

const parseResumeContent = (text) => {
    const categories = {
        languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL'],
        frameworks: ['React', 'Next.js', 'Express', 'Node.js'],
        tools: ['Git', 'Docker', 'AWS', 'PostgreSQL']
    };
    const identifiedSkills = {
        languages: categories.languages.filter(s => new RegExp(`\\b${escapeRegExp(s)}\\b`, 'i').test(text)),
        frameworks: categories.frameworks.filter(s => new RegExp(`\\b${escapeRegExp(s)}\\b`, 'i').test(text)),
        tools: categories.tools.filter(s => new RegExp(`\\b${escapeRegExp(s)}\\b`, 'i').test(text))
    };
    return { text, skills: identifiedSkills, allSkills: [...identifiedSkills.languages, ...identifiedSkills.frameworks, ...identifiedSkills.tools] };
};

const analyzeResume = (parsedData, targetRole = 'General', jobDescription = '') => {
    const { text = "", allSkills = [] } = parsedData;
    let impactScore = 60, styleScore = 70;
    const strengths = [];
    if (/managed|led|developed|implemented/i.test(text)) { impactScore += 20; strengths.push("Strong action verbs"); }
    if (/\d+%|\$\d+|million/i.test(text)) { impactScore += 15; strengths.push("Quantifiable metrics"); }

    let targetKeywords = roleKeywords[targetRole] || roleKeywords['General'];
    if (jobDescription) {
        const jdKeywords = extractKeywordsFromJD(jobDescription);
        if (jdKeywords.length > 0) targetKeywords = jdKeywords;
    }
    const matchedKeywords = targetKeywords.filter(k => new RegExp(`\\b${escapeRegExp(k)}\\b`, 'i').test(text));
    const skillMatchScore = targetKeywords.length > 0 ? Math.round((matchedKeywords.length / targetKeywords.length) * 100) : 70;
    const finalScore = Math.round((impactScore + styleScore + skillMatchScore) / 3);
    const status = finalScore >= 75 ? 'Selected' : (finalScore >= 60 ? 'Consider' : 'Rejected');

    return {
        score: finalScore, matchPercentage: skillMatchScore, verdict: status, status,
        reasons: status === 'Rejected' ? ["Low relevance to role"] : [],
        matchedSkills: matchedKeywords,
        missingSkills: targetKeywords.filter(k => !matchedKeywords.includes(k)),
        skills: allSkills.slice(0, 15),
        strengths: strengths.length > 0 ? strengths : ["Standard structure"]
    };
};

const optimizeResume = (analysis, targetRole) => {
    const { score, extractedText = "" } = analysis;
    const details = extractPersonalDetails(extractedText);
    return {
        improvedResume: `# ${details.name}\nObjective updated for ${targetRole}...`,
        structuredData: { name: details.name, contact: { email: details.email, phone: details.phone }, department: targetRole },
        targetScore: 95
    };
};

// --- UTILS: EMAIL SERVICE ---
const sendEmail = async ({ toEmail, toName, subject, htmlContent }) => {
    if (BREVO_API_KEY === 'your_brevo_api_key_here') return null;
    try {
        await axios.post(BREVO_API_URL, {
            sender: { name: 'Forge AI Recruitment', email: 'no-reply@forge-ai.com' },
            to: [{ email: toEmail, name: toName }],
            subject, htmlContent
        }, { headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' } });
    } catch (e) { console.error('Email failed:', e.message); }
};

// --- DATABASE LOGIC ---
const readDB = () => {
    try {
        if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        return inMemoryDB;
    } catch (e) { return inMemoryDB; }
};
const writeDB = (data) => {
    inMemoryDB = data;
    try { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); } catch (e) {}
};

// --- EXPRESS APP ---
const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 }, storage: multer.memoryStorage() });

router.get('/health', (req, res) => res.json({ status: 'ok', environment: 'Atomic Serverless V3 ESM', timestamp: new Date().toISOString() }));

router.post('/analyze', upload.single('resume'), async (req, res) => {
    try {
        const file = req.file;
        const { role = 'General', jd = '' } = req.body;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        let text = "";
        if (file.mimetype === 'application/pdf') text = await extractTextFromPDF(file.buffer);
        else if (file.mimetype.includes('word')) text = await extractTextFromDOCX(file.buffer);
        
        const parsedData = parseResumeContent(text);
        const analysisResults = analyzeResume(parsedData, role, jd);
        res.json({ ...analysisResults, role, extractedText: text });
    } catch (error) {
        res.status(500).json({ error: 'Analysis failed', details: error.message });
    }
});

router.post('/analyze/optimize', async (req, res) => {
    const { analysis, role } = req.body;
    res.json(optimizeResume(analysis, role));
});

router.get('/candidates', (req, res) => res.json(readDB().candidates));
router.post('/candidates', (req, res) => {
    const db = readDB();
    const candidate = { id: Date.now().toString(), ...req.body, timestamp: new Date().toISOString() };
    db.candidates.push(candidate);
    writeDB(db);
    res.status(201).json(candidate);
});

router.patch('/candidates/:id', (req, res) => {
    const db = readDB();
    const idx = db.candidates.findIndex(c => c.id === req.params.id);
    if (idx !== -1) {
        db.candidates[idx] = { ...db.candidates[idx], ...req.body };
        writeDB(db);
        res.json(db.candidates[idx]);
    } else res.status(404).json({ error: 'Not found' });
});

router.delete('/candidates/:id', (req, res) => {
    const db = readDB();
    db.candidates = db.candidates.filter(c => c.id !== req.params.id);
    writeDB(db);
    res.status(204).send();
});

router.post('/interviews/generate', (req, res) => {
    res.json({ token: crypto.randomBytes(16).toString('hex') });
});

app.use('/api', router);
app.use('/', router);

export default app;
