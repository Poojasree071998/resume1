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

  const { role, analysisResults } = req.body;
  
  return res.status(200).json([
    { type: 'Technical', title: 'State Management', question: 'How would you handle global state in a multi-tenant dashboard app using the specialized hooks you mentioned?' },
    { type: 'Technical', title: 'Optimization', question: 'Explain your strategy for reducing Time to Interactive (TTI) in a heavy data visualization dashboard.' },
    { type: 'HR', title: 'Team Culture', question: 'Tell me about a time you mentored a junior developer during a critical sprint. What was the outcome?' },
    { type: 'Project', title: 'Security', question: 'In your resume, you listed JWT auth. How did you handle token refresh and cross-site scripting (XSS) prevention?' }
  ]);
}
