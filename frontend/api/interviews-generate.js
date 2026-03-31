import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userRole, candidateId, candidateEmail } = req.body;
  
  if (userRole !== 'HR') {
    return res.status(403).json({ error: 'Only HR can generate interview links' });
  }

  try {
    const token = uuidv4();
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 48); // 48-hour expiry

    // In a real app, this would be saved to a database and an email would be sent.
    // For this standalone function, we'll return the successful metadata.
    console.log(`Generated interview token ${token} for candidate ${candidateId}`);

    return res.status(200).json({
      success: true,
      token,
      expiry,
      message: 'Interview link generated successfully. (Note: Email service requires BREVO_API_KEY)'
    });
  } catch (error) {
    console.error('Interview generation error:', error);
    return res.status(500).json({ error: 'Failed to generate interview link' });
  }
}
