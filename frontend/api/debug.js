export default function handler(req, res) {
  res.status(200).json({ 
    status: 'debug_ok_esm', 
    timestamp: new Date().toISOString(),
    message: 'ES Module serverless function reached successfully' 
  });
}
