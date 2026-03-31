import fs from 'fs';
import path from 'path';

const DB_PATH = path.join('/tmp', 'database.json');
let inMemoryDB = { candidates: [] };

const readDB = () => {
    try {
        if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        return inMemoryDB;
    } catch (e) { return inMemoryDB; }
};

const writeDB = (data) => {
    inMemoryDB = data;
    try { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); } catch (e) {}
};

export default async function handler(req, res) {
  const { method } = req;
  const db = readDB();

  if (method === 'GET') {
    return res.status(200).json(db.candidates);
  }

  if (method === 'POST') {
    const candidate = { id: Date.now().toString(), ...req.body, timestamp: new Date().toISOString() };
    db.candidates.push(candidate);
    writeDB(db);
    return res.status(201).json(candidate);
  }

  if (method === 'PATCH') {
    const { id } = req.query;
    const idx = db.candidates.findIndex(c => c.id === id);
    if (idx !== -1) {
      db.candidates[idx] = { ...db.candidates[idx], ...req.body };
      writeDB(db);
      return res.status(200).json(db.candidates[idx]);
    }
    return res.status(404).json({ error: 'Candidate not found' });
  }

  if (method === 'DELETE') {
    const { id } = req.query;
    db.candidates = db.candidates.filter(c => c.id !== id);
    writeDB(db);
    return res.status(204).send();
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
