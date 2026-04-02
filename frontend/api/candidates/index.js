import dbConnect from '../utils/db.js';
import Candidate from '../models/Candidate.js';
import { sendUploadConfirmation } from '../utils/emailService.js';

// VERCEL SERVERLESS FUNCTIONS ARE NOW STATEFUL WITH MONGODB
export default async function handler(req, res) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log(`[CANDIDATES API] ${req.method} request received.`);
    
    // Initializing Database connection
    const db = await dbConnect().catch(dbErr => {
      console.error('[CANDIDATES API] Connection failed:', dbErr.message);
      return null;
    });
    
    // Fallback if DB is not configured or connection failed
    if (!db) {
      console.warn('[CANDIDATES API] No active DB connection available.');
      if (req.method === 'GET') {
        return res.status(200).json([]); // Suppress UI crash
      }
      return res.status(503).json({ 
        error: 'Database Connectivity Issue', 
        details: 'The API is unable to reach MongoDB. Check MONGODB_URI and IP Whitelisting.' 
      });
    }

    if (req.method === 'GET') {
      console.log('[CANDIDATES API] Fetching candidates from database...');
      const candidates = await Candidate.find({}).sort({ createdAt: -1 }).limit(100);
      console.log(`[CANDIDATES API] Successfully retrieved ${candidates.length} candidates.`);
      return res.status(200).json(candidates || []);
    } 

    if (req.method === 'POST') {
      const candidateData = req.body;
      console.log('[CANDIDATES API] Attempting to create new candidate:', candidateData.name);
      
      if (!candidateData.name) {
        return res.status(400).json({ error: 'Candidate name is required' });
      }
      
      // Ensure we don't save duplicate candidates by email in the same session? 
      // (Optional logic, but for now we just create)
      
      const newCandidate = await Candidate.create({
        ...candidateData,
        status: candidateData.status || 'Applied',
        updatedAt: new Date()
      });

      console.log(`[CANDIDATES API] Candidate created with ID: ${newCandidate._id}`);

      // --- SEND CONFIRMATION EMAIL (NON-BLOCKING) ---
      if (newCandidate.email && newCandidate.email.includes('@')) {
        sendUploadConfirmation({
          email: newCandidate.email,
          name: newCandidate.name
        }).then(() => {
          console.log(`[CANDIDATES API] Confirmation email queued for ${newCandidate.email}`);
        }).catch(err => {
          console.error('[CANDIDATES API] Email service failed:', err.message);
        });
      }

      return res.status(201).json(newCandidate);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[CANDIDATES API] Critical Exception:', error);
    if (req.method === 'GET') {
      return res.status(200).json([]);
    }
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

