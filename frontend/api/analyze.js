import multer from 'multer';
import mammoth from 'mammoth';
import dbConnect from './_utils/db.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
}).single('resume');

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const roleKeywords = {
    'Frontend': ['React', 'JavaScript', 'TypeScript', 'Tailwind', 'Next.js', 'Redux', 'Architecture', 'TTI', 'Core Web Vitals', 'Performant', 'Accessible'],
    'Backend': ['Node.js', 'Go', 'Python', 'Microservices', 'distributed systems', 'high-availability', 'concurrency', 'API engineering', 'PostgreSQL', 'Kubernetes'],
    'Fullstack': ['React', 'Next.js', 'TypeScript', 'Node.js', 'tRPC', 'Prisma', 'E2E testing', 'SaaS', 'System Design'],
    'BDA': ['Data', 'Analytics', 'SQL', 'Tableau', 'Power BI', 'Statstical', 'ETL', 'Business', 'Strategy', 'KPI'],
    'Sales': ['Revenue', 'Market Expansion', 'CRM', 'Lead Generation', 'B2B', 'GTM', 'Negotiation', 'Strategic'],
    'General': ['Git', 'Communication', 'Teamwork', 'Agile', 'Leadership', 'Problem Solving']
};

// --- Robust File Extraction ---
const extractTextFromPDF = async (buffer) => {
    try {
        if (!buffer || buffer.length === 0) return "";
        console.log(`[ANALYZE API] Attempting PDF extraction (${buffer.length} bytes)...`);
        
        const options = {
            pagerender: (pageData) => {
                return pageData.getTextContent()
                    .then(textContent => textContent.items.map(item => item.str).join(' '));
            }
        };

        const data = await pdfParse(buffer, options);
        return data.text || "";
    } catch (error) {
        console.error('[ANALYZE API] PDF Extraction Error:', error.message);
        if (error.message.includes('XRef') || error.message.includes('dictionary')) {
            throw new Error('This PDF appears to have a corrupted structure (bad XRef table). Try "Saving as PDF" again from your document editor.');
        }
        throw error;
    }
};

const extractTextFromDOCX = async (buffer) => {
    try {
        if (!buffer || buffer.length === 0) return "";
        const result = await mammoth.extractRawText({ buffer });
        return result.value || "";
    } catch (error) {
        console.error('[ANALYZE API] DOCX Parsing Error:', error.message);
        throw new Error('Failed to read DOCX file. The document might be corrupted.');
    }
};

// --- Analysis Logic ---
const analyzeResume = (text, targetRole = 'General') => {
    let impactScore = 55;
    let skillMatchScore = 35;
    let styleScore = 65;
    const strengths = [];
    const weaknesses = [];
    const suggestions = [];

    if (!text || text.trim().length < 50) return { score: 0, error: "Sparse content" };

    if (/managed|led|directed|developed|implemented/i.test(text)) {
        impactScore += 20;
        strengths.push("Strong use of action verbs");
    }
    if (/\d+%|\$\d+|million|billion/i.test(text)) {
        impactScore += 20;
        strengths.push("Uses quantifiable metrics");
    }

    let targetKeywords = roleKeywords[targetRole] || roleKeywords['General'];
    const matchedKeywords = targetKeywords.filter(k => new RegExp(`\\b${escapeRegExp(k.trim())}\\b`, 'i').test(text));
    
    skillMatchScore = targetKeywords.length > 0 ? Math.round((matchedKeywords.length / targetKeywords.length) * 100) : 70;
    const finalScore = Math.round((impactScore + 80 + skillMatchScore) / 3);
    let status = 'Applied'; // Formal status default

    return {
        score: finalScore,
        matchPercentage: skillMatchScore,
        verdict: finalScore >= 75 ? 'Selected' : (finalScore >= 60 ? 'Consider' : 'Rejected'),
        status: status,
        matchedSkills: matchedKeywords,
        missingSkills: targetKeywords.filter(k => !matchedKeywords.includes(k)),
        skills: matchedKeywords.slice(0, 15),
        strengths: strengths.slice(0, 4),
        weaknesses: weaknesses,
        suggestions: suggestions
    };
};

// --- Optimization Logic ---
const extractPersonalDetails = (text = "") => {
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    return {
        name: lines.length > 0 ? String(lines[0]).toUpperCase() : "CANDIDATE",
        email: emailMatch ? emailMatch[0] : "contact@email.com"
    };
};

const optimizeResume = (analysis, targetRole) => {
    const details = extractPersonalDetails(analysis.extractedText || "");
    return {
        improvedResume: `# ${details.name}\nOptimized for ${targetRole}`,
        changesMade: ["Targeted career objective updated", "Standardized formatting"],
        targetScore: 98,
        targetMatch: 98
    };
};

const runMiddleware = (req, res, fn) => new Promise((resolve, reject) => {
  fn(req, res, (result) => result instanceof Error ? reject(result) : resolve(result));
});

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);

  try {
    // --- Logic for /api/analyze/optimize ---
    if (pathname.includes('/optimize') && req.method === 'POST') {
      // Handle the body manually because bodyParser is disabled for multer
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      
      const optimization = optimizeResume(body.analysis, body.role);
      return res.status(200).json({ ...optimization });
    }

    // --- Logic for /api/analyze ---
    await runMiddleware(req, res, upload);
    const file = req.file;
    const { role = 'General' } = req.body;
    
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    let text = "";
    if (file.mimetype === 'application/pdf') {
        text = await extractTextFromPDF(file.buffer);
    } else if (file.mimetype.includes('word') || file.mimetype.includes('officedocument')) {
        text = await extractTextFromDOCX(file.buffer);
    }

    const results = analyzeResume(text, role);
    const finalData = { ...results, role, extractedText: text };

    try {
        await dbConnect();
        const Candidate = (await import('./_models/Candidate.js')).default;
        const details = extractPersonalDetails(text);
        await Candidate.create({
            name: details.name,
            email: details.email,
            fileName: file.originalname,
            status: 'Applied',
            score: finalData.score,
            matchPercentage: finalData.matchPercentage,
            verdict: finalData.verdict,
            extractedText: text,
            timestamp: new Date()
        });
    } catch (dbErr) { console.error('[DB ERROR]', dbErr.message); }

    return res.status(200).json(finalData);
  } catch (error) {
    console.error('[API ERROR]', error);
    return res.status(500).json({ error: 'Process failed', details: error.message });
  }
}
