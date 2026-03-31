import multer from 'multer';
import mammoth from 'mammoth';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('resume');

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

// --- ANALYSIS LOGIC ---
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const roleKeywords = {
    'Frontend': ['React', 'JavaScript', 'TypeScript', 'Tailwind', 'Next.js', 'Redux', 'Architecture', 'TTI', 'Core Web Vitals', 'Performant', 'Accessible'],
    'Backend': ['Node.js', 'Go', 'Python', 'Microservices', 'distributed systems', 'high-availability', 'concurrency', 'API engineering', 'PostgreSQL', 'Kubernetes'],
    'Fullstack': ['React', 'Next.js', 'TypeScript', 'Node.js', 'tRPC', 'Prisma', 'E2E testing', 'SaaS', 'System Design'],
    'BDA': ['Data', 'Analytics', 'SQL', 'Tableau', 'Power BI'],
    'Sales': ['Revenue', 'Market Expansion', 'CRM', 'Lead Generation', 'B2B', 'GTM'],
    'General': ['Git', 'Communication', 'Teamwork', 'Agile', 'Leadership']
};

const analyzeResume = (text, targetRole = 'General') => {
    let impactScore = 60, styleScore = 70;
    const strengths = [];
    if (/managed|led|developed|implemented/i.test(text)) { impactScore += 20; strengths.push("Strong action verbs"); }
    if (/\d+%|\$\d+|million/i.test(text)) { impactScore += 15; strengths.push("Quantifiable metrics"); }

    const targetKeywords = roleKeywords[targetRole] || roleKeywords['General'];
    const matchedKeywords = targetKeywords.filter(k => new RegExp(`\\b${escapeRegExp(k)}\\b`, 'i').test(text));
    const skillMatchScore = targetKeywords.length > 0 ? Math.round((matchedKeywords.length / targetKeywords.length) * 100) : 70;
    const finalScore = Math.round((impactScore + styleScore + skillMatchScore) / 3);
    const status = finalScore >= 75 ? 'Selected' : (finalScore >= 60 ? 'Consider' : 'Rejected');

    return {
        score: finalScore, matchPercentage: skillMatchScore, verdict: status, status,
        reasons: status === 'Rejected' ? ["Low relevance to role"] : [],
        matchedSkills: matchedKeywords,
        missingSkills: targetKeywords.filter(k => !matchedKeywords.includes(k)),
        skills: matchedKeywords.slice(0, 15),
        strengths: strengths.length > 0 ? strengths : ["Standard structure"]
    };
};

// Help helper for multer in Vercel
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
};

export const config = { api: { bodyParser: false } }; // Disable body parser for multer

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send({ message: 'Only POST allowed' });

  try {
    await runMiddleware(req, res, upload);
    const file = req.file;
    const { role = 'General' } = req.body;
    
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    let text = "";
    if (file.mimetype === 'application/pdf') text = await extractTextFromPDF(file.buffer);
    else if (file.mimetype.includes('word')) text = await extractTextFromDOCX(file.buffer);

    const results = analyzeResume(text, role);
    return res.status(200).json({ ...results, role, extractedText: text });
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
}
