import { v4 as uuidv4 } from 'uuid';
import { sendInterviewEmail } from '../utils/emailService.js';

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

  const { userRole, candidateId, candidateEmail, candidateName } = req.body;
  
  if (userRole !== 'HR') {
    return res.status(403).json({ error: 'Only HR can generate interview links' });
  }

  try {
    const token = uuidv4();
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 48);

    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'];
    const interviewLink = `${protocol}://${host}/interview/${token}`;

    // Send the email if candidate details are provided
    if (candidateEmail && candidateName) {
      await sendInterviewEmail(
        { email: candidateEmail, name: candidateName },
        { 
          date: new Date(expiry).toLocaleDateString(), 
          time: new Date(expiry).toLocaleTimeString(), 
          link: interviewLink 
        }
      );
    }

    return res.status(200).json({
      success: true,
      token,
      expiry,
      link: interviewLink,
      message: 'Interview link generated and emailed successfully.'
    });
  } catch (error) {
    console.error('Interview generation error:', error);
    return res.status(500).json({ error: 'Failed to generate interview link' });
  }
}
