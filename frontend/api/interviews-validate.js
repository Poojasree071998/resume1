export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // In Vercel, the query param 'token' is available via req.query.token
  const { token } = req.query;
  
  if (!token) return res.status(400).json({ error: 'Missing token' });

  // In a real app, this would query a database to validate the token.
  // We'll mock a successful validation for demo purposes.
  console.log(`Validating interview token: ${token}`);

  return res.status(200).json({
    isValid: true,
    candidateName: "DEMO CANDIDATE",
    role: "React Developer",
    message: "Interview token successfully validated."
  });
}
