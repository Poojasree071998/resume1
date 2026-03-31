import { sendUploadConfirmation } from '../utils/emailService.js';

// VERCEL SERVERLESS FUNCTIONS ARE STATELESS
// To make this persistent, connect a real database like MongoDB Atlas or Supabase
let candidates = []; 

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      return res.status(200).json(candidates);
    } 

    if (req.method === 'POST') {
      const candidate = req.body;
      if (!candidate.name) return res.status(400).json({ error: 'Candidate name is required' });
      
      const newCandidate = {
        ...candidate,
        id: candidate.id || Date.now().toString(),
        date: new Date().toISOString()
      };
      
      candidates.push(newCandidate);

      // --- SEND CONFIRMATION EMAIL ---
      if (newCandidate.email && newCandidate.email.includes('@')) {
        await sendUploadConfirmation({
          email: newCandidate.email,
          name: newCandidate.name
        });
      }

      return res.status(201).json(newCandidate);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Candidates API Error:', error);
    return res.status(500).json({ error: 'Failed to process candidate request' });
  }
}
