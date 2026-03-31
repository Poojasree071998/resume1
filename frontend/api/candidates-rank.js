export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { candidates = [] } = req.body;
  if (!candidates || candidates.length === 0) {
    return res.status(400).json({ error: 'No candidates provided for ranking' });
  }

  // Pure function for ranking candidates by score
  const ranked = [...candidates].sort((a, b) => (b.score || 0) - (a.score || 0));

  return res.status(200).json(ranked);
}
