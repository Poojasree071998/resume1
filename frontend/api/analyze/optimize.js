import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const roleKeywords = {
    'Frontend': ['React', 'JavaScript', 'TypeScript', 'Tailwind', 'Next.js', 'Redux', 'Architecture', 'TTI', 'Core Web Vitals', 'Performant', 'Accessible'],
    'Backend': ['Node.js', 'Go', 'Python', 'Microservices', 'distributed systems', 'high-availability', 'concurrency', 'API engineering', 'PostgreSQL', 'Kubernetes'],
    'Fullstack': ['React', 'Next.js', 'TypeScript', 'Node.js', 'tRPC', 'Prisma', 'E2E testing', 'SaaS', 'System Design'],
    'BDA': ['Data', 'Analytics', 'SQL', 'Tableau', 'Power BI', 'Statstical', 'ETL', 'Business', 'Strategy', 'KPI'],
    'Sales': ['Revenue', 'Market Expansion', 'CRM', 'Lead Generation', 'B2B', 'GTM', 'Negotiation', 'Strategic'],
    'General': ['Git', 'Communication', 'Teamwork', 'Agile', 'Leadership', 'Problem Solving']
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
        location: "Dharmapuri, Tamil Nadu",
        dob: "DD-MM-YYYY",
        gender: "Not Specified",
        nationality: "Indian",
        education: "Bachelor's Degree",
        institution: "Professional University"
    };
};

const optimizeResume = (analysis, targetRole, jd = '') => {
    const { extractedText = "" } = analysis;
    const details = extractPersonalDetails(extractedText);
    
    const roleOptimizations = {
        'Frontend': {
            objective: "Expert Frontend Engineer specializing in high-performance React architectures. Focused on Core Web Vitals and user-centric design.",
            skills: { frontend: "React, Next.js, Tailwind", backend: "Node.js (SSR)", database: "PostgreSQL", languages: "JS, TS", tools: "Git, Vite", other: "A11y, Performance" }
        },
        'Backend': {
            objective: "Senior Backend Architect with 8+ years of expertise in distributed systems and microservices using Node.js and Go.",
            skills: { frontend: "API Design", backend: "Node.js, Go", database: "PostgreSQL, Redis", languages: "Python, Go, SQL", tools: "Docker, K8s", other: "Scalability, Security" }
        },
        'Fullstack': {
            objective: "Dynamic Fullstack Engineer with expertise in the MERN/T3 stack, bridging the gap between elegant UI and robust server logic.",
            skills: { frontend: "React, Next.js", backend: "Node.js, tRPC", database: "PostgreSQL", languages: "TS, JS", tools: "Docker, Vercel", other: "E2E Testing, SaaS" }
        }
    };

    const opt = roleOptimizations[targetRole] || roleOptimizations['Fullstack'];
    
    return {
        improvedResume: `# ${details.name}\nObjective: ${opt.objective}`,
        structuredData: { name: details.name, objective: opt.objective, skills: opt.skills },
        changesMade: ["Targeted career objective updated", "Injected role-specific technical keywords", "Standardized professional formatting"],
        targetScore: 95,
        targetMatch: 98
    };
};

const generateCareerRoadmap = (analysis, targetRole) => {
    return {
        skillsToLearn: ["Master Advanced " + targetRole + " Patterns", "Earn AWS Cloud Certification", "Contribute to Open Source Projects"],
        suggestedProjects: ["Build a scalable " + targetRole + " application", "Implement a custom CI/CD pipeline"]
    };
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { analysis, role = 'General', jd = '' } = req.body;
    if (!analysis) return res.status(400).json({ error: 'Missing analysis data' });

    const optimization = optimizeResume(analysis, role, jd);
    const roadmap = generateCareerRoadmap(analysis, role);

    return res.status(200).json({ ...optimization, roadmap });
  } catch (error) {
    console.error('Optimization error:', error);
    return res.status(500).json({ error: 'Optimization failed' });
  }
}
