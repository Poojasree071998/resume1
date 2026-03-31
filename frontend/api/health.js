export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    engine: 'Vercel Serverless Functions (Native)',
    timestamp: new Date().toISOString()
  });
}
