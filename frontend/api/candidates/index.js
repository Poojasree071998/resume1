import dbConnect from '../utils/db.js';
import Candidate from '../models/Candidate.js';
import { sendUploadConfirmation } from '../utils/emailService.js';

// VERCEL SERVERLESS FUNCTIONS ARE NOW STATEFUL WITH MONGODB
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
    // Initializing Database connection
    await dbConnect();

    if (req.method === 'GET') {
      const candidates = await Candidate.find({}).sort({ createdAt: -1 }).limit(100);
      return res.status(200).json(candidates);
    } 

    if (req.method === 'POST') {
      const candidateData = req.body;
      if (!candidateData.name) return res.status(400).json({ error: 'Candidate name is required' });
      
      const newCandidate = await Candidate.create({
        ...candidateData,
        status: candidateData.status || 'Applied'
      });

      // --- SEND CONFIRMATION EMAIL ---
      if (newCandidate.email && newCandidate.email.includes('@')) {
        try {
          await sendUploadConfirmation({
            email: newCandidate.email,
            name: newCandidate.name
          });
        } catch (err) {
          console.error('Email service failed (continuing):', err.message);
        }
      }

      return res.status(201).json(newCandidate);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Candidates API Error:', error);
    return res.status(500).json({ error: 'Failed to process candidate request', details: error.message });
  }
}
