import multer from 'multer';
import mammoth from 'mammoth';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
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

// Use a simpler approach for pdfjs in serverless
const extractTextFromPDF = async (buffer) => {
    try {
        if (!buffer || buffer.length === 0) {
            console.error("[ANALYZE API] PDF Parsing Error: Buffer is empty");
            return "";
        }
        
        console.log(`[ANALYZE API] Attempting PDF extraction (${buffer.length} bytes)...`);
        const data = await pdfParse(buffer);
        
        const extractedText = data.text || "";
        if (extractedText.trim().length < 10) {
            console.warn("[ANALYZE API] PDF Parsing Warning: Extracted text is very short.");
        } else {
            console.log(`[ANALYZE API] PDF Extraction Success: ${extractedText.length} chars.`);
        }
        
        return extractedText;
    } catch (error) {
        console.error('[ANALYZE API] PDF Parsing Critical Error:', error.message);
        return "";
    }
};

const extractTextFromDOCX = async (buffer) => {
    try {
        console.log(`[ANALYZE API] Attempting DOCX extraction (${buffer.length} bytes)...`);
        const result = await mammoth.extractRawText({ buffer });
        console.log(`[ANALYZE API] DOCX Extraction Success: ${result.value.length} chars.`);
        return result.value;
    } catch (error) {
        console.error('[ANALYZE API] Error parsing DOCX:', error.message);
        return "";
    }
};

const analyzeResume = (text, targetRole = 'General') => {
    let impactScore = 55;
    let skillMatchScore = 35;
    let styleScore = 65;

    const strengths = [];
    const weaknesses = [];
    const suggestions = [];

    if (!text || text.trim().length < 50) {
        return {
            score: 0,
            error: "Document content is too sparse for analysis. Please ensure the file is not corrupted or image-based."
        };
    }

    // 1. Impact Analysis
    if (/managed|led|directed|developed|implemented/i.test(text)) {
        impactScore += 20;
        strengths.push("Strong use of action verbs to describe professional impact");
    }
    if (/\d+%|\$\d+|million|billion/i.test(text)) {
        impactScore += 20;
        strengths.push("Uses quantifiable metrics to demonstrate impact");
    }

    let targetKeywords = roleKeywords[targetRole] || roleKeywords['General'];
    
    const matchedKeywords = targetKeywords.filter(k => {
        try {
            return new RegExp(`\\b${escapeRegExp(k.trim())}\\b`, 'i').test(text);
        } catch (e) {
            return text.toLowerCase().includes(k.toLowerCase());
        }
    });
    
    skillMatchScore = targetKeywords.length > 0 
        ? Math.round((matchedKeywords.length / targetKeywords.length) * 100) 
        : 70;

    if (skillMatchScore > 75) strengths.push(`Strong keyword alignment for ${targetRole} role`);
    else if (targetRole !== 'General') {
        weaknesses.push(`Keyword gap for ${targetRole} requirements`);
        suggestions.push(`Consider adding skills like: ${targetKeywords.slice(0, 3).join(', ')}`);
    }

    // 3. Style and Structure
    const sections = {
        experience: /experience|work history|employment|career/i.test(text),
        education: /education|degree|university|college|academic/i.test(text),
        contact: /email|phone|contact|address|linkedin/i.test(text),
        projects: /projects|portfolio|personal work/i.test(text)
    };
    if (sections.experience) styleScore += 10;
    if (sections.education) styleScore += 10;
    if (sections.contact) styleScore += 10;
    if (sections.projects) styleScore += 10;
    
    if (styleScore >= 40) {
        strengths.push("Strong professional formatting and document structure");
    } else {
        weaknesses.push("Missing key resume sections (e.g., Experience or Projects)");
    }
    styleScore = Math.min(styleScore, 100);

    const finalScore = Math.round((impactScore + styleScore + skillMatchScore) / 3);

    // 5. Communication Analysis
    let commScore = 70;
    const commFeedback = [];
    if (/managed|led|coordinated|developed|designed/i.test(text)) {
        commScore += 15;
        commFeedback.push("Clear and professional tone");
    }
    if (text.length > 500) {
        commScore += 10;
        commFeedback.push("Good descriptive clarity");
    }
    commScore = Math.min(commScore, 100);

    let status = finalScore >= 75 ? 'Selected' : (finalScore >= 60 ? 'Consider' : 'Rejected');

    return {
        score: finalScore,
        matchPercentage: skillMatchScore,
        verdict: status,
        status: status,
        reasons: status === 'Rejected' ? (weaknesses.length > 0 ? weaknesses : ["Low relevance to job role"]) : [],
        weaknesses: weaknesses.length > 0 ? weaknesses : ["Could use more quantifiable metrics"],
        suggestions: suggestions.length > 0 ? suggestions : ["Consider tailoring your summary to specific job descriptions"],
        matchedSkills: matchedKeywords,
        missingSkills: targetKeywords.filter(k => !matchedKeywords.includes(k)),
        skills: matchedKeywords.length > 0 ? matchedKeywords.slice(0, 15) : ["Industry Proficiency"],
        strengths: strengths.length > 0 ? strengths.slice(0, 4) : ["Good basic structure"],
        communicationScore: commScore,
        communicationAnalysis: commFeedback
    };
};

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
};

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') return res.status(405).send({ message: 'Only POST allowed' });

  try {
    console.log('[ANALYZE API] Processing file upload...');
    await runMiddleware(req, res, upload);
    
    const file = req.file;
    const { role = 'General' } = req.body;
    
    if (!file) {
        console.error('[ANALYZE API] No file found in request');
        return res.status(400).json({ error: 'No file uploaded' });
    }

    let text = "";
    if (file.mimetype === 'application/pdf') {
        text = await extractTextFromPDF(file.buffer);
    } else if (file.mimetype.includes('word') || file.mimetype.includes('officedocument')) {
        text = await extractTextFromDOCX(file.buffer);
    } else {
        console.warn(`[ANALYZE API] Unsupported mimetype: ${file.mimetype}`);
        return res.status(400).json({ error: 'Unsupported file format. Please upload PDF or DOCX.' });
    }

    if (!text || text.trim().length < 10) {
        return res.status(422).json({ 
            error: 'Could not extract text from document', 
            details: 'The file might be password protected, corrupted, or an image-based PDF without OCR.' 
        });
    }

    const results = analyzeResume(text, role);
    console.log(`[ANALYZE API] Analysis complete. Score: ${results.score}`);
    
    return res.status(200).json({ ...results, role, extractedText: text });
  } catch (error) {
    console.error('[ANALYZE API] Critical Analysis error:', error);
    return res.status(500).json({ 
        error: 'Analysis failed', 
        details: error.message,
        tip: 'Ensure the file is a valid PDF/DOCX and under 10MB.'
    });
  }
}

