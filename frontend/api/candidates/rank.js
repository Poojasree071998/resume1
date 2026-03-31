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

  const { candidates = [] } = req.body;
  
  if (!candidates || candidates.length === 0) {
    return res.status(400).json({ error: 'No candidates provided for ranking' });
  }

  const ranked = [...candidates].sort((a, b) => (b.score || 0) - (a.score || 0));

  return res.status(200).json(ranked);
}
