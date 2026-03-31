const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { sendUploadConfirmation, sendInterviewEmail, sendSelectionEmail, sendRejectionEmail } = require('../utils/emailService');


const DB_PATH = path.join(__dirname, '..', 'database.json');

let inMemoryDB = { candidates: [] };

const readDB = () => {
    try {
        if (fs.existsSync(DB_PATH)) {
            const data = fs.readFileSync(DB_PATH, 'utf8');
            const parsed = JSON.parse(data);
            inMemoryDB = parsed; // Sync in-memory with file if possible
            return parsed;
        }
        return inMemoryDB;
    } catch (error) {
        console.error('Error reading database:', error);
        return inMemoryDB;
    }
};

const writeDB = (data) => {
    try {
        inMemoryDB = data; // Always update in-memory
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        // This is expected on Vercel/Serverless
        console.warn('Database write failed (likely read-only filesystem). Data persists in memory for this session.', error.message);
    }
};

const getCandidates = (req, res) => {
    const db = readDB();
    res.json(db.candidates);
};

const addCandidate = (req, res) => {
    const db = readDB();
    const status = req.body.status || 'Applied';
    const timestamp = Date.now();
    const notifications = [
        {
            id: `${timestamp}-1`,
            type: 'Confirmation',
            message: 'Application received successfully. AI initial screening in progress.',
            date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
        }
    ];

    // If candidate is already Selected or Rejected during initial analysis
    if (status === 'Selected') {
        notifications.push({
            id: `${timestamp}-2`,
            type: 'Selected',
            message: 'Congratulations! You have been selected for the next round.',
            date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
        });
    } else if (status === 'Rejected') {
        notifications.push({
            id: `${timestamp}-2`,
            type: 'Rejected',
            message: 'Thank you for your interest. Unfortunately, we will not be moving forward with your application.',
            date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
        });
    }

    const newCandidate = {
        id: timestamp.toString(),
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }),
        ...req.body,
        status,
        notifications
    };
    db.candidates.push(newCandidate);
    writeDB(db);

    // Trigger Upload Confirmation Email
    if (newCandidate.email && newCandidate.email !== 'candidate@example.com') {
        sendUploadConfirmation(newCandidate);
    }

    res.status(201).json(newCandidate);
};

const updateCandidate = (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.candidates.findIndex(c => c.id === id);
    
    if (index !== -1) {
        const oldStatus = db.candidates[index].status;
        const newStatus = req.body.status || oldStatus;
        
        // Preserve interview token if it exists
        const existingToken = db.candidates[index].interview?.token;
        
        // Merge updates
        db.candidates[index] = { ...db.candidates[index], ...req.body };

        // If we have an existing token but the merge removed it (because req.body.interview was passed without it), restore it
        if (existingToken && db.candidates[index].interview) {
            db.candidates[index].interview.token = existingToken;
        }

        
        // Ensure notifications array exists
        if (!db.candidates[index].notifications) {
            db.candidates[index].notifications = [];
        }

        // Add Notification for Status Change
        if (req.body.status && req.body.status !== oldStatus) {
            let message = `Status updated to ${req.body.status.toUpperCase()}.`;
            let link = null;

            if (req.body.status === 'Selected') message = 'Congratulations! You have been selected for the next round.';
            if (req.body.status === 'Rejected') message = 'Thank you for your interest. Unfortunately, we will not be moving forward with your application.';
            if (req.body.status === 'Interview') {
                const { date, time, link: meetLink } = req.body.interview || {};
                message = `Your interview has been scheduled for ${date || 'TBD'} at ${time || 'TBD'}. Please check the meeting link to join.`;
                link = meetLink;
            }
            if (req.body.status === 'Offer Sent') message = 'Status updated to OFFER SENT.';

            db.candidates[index].notifications.push({
                id: Date.now().toString(),
                type: req.body.status,
                message,
                link,
                date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
            });

            // Trigger Email Notifications (Brevo Integration)
            const candidate = db.candidates[index];
            if (candidate.email && candidate.email !== 'candidate@example.com') {
                if (req.body.status === 'Interview') {
                    // If no token exists at all (even in the link), generate one
                    if (!db.candidates[index].interview.token) {
                        const link = db.candidates[index].interview.link;
                        const tokenMatch = link?.match(/\/interview\/([a-f0-9]+)/);
                        const token = tokenMatch ? tokenMatch[1] : crypto.randomBytes(16).toString('hex');
                        
                        db.candidates[index].interview.token = token;
                    }

                    sendInterviewEmail(db.candidates[index], db.candidates[index].interview);
                } else if (req.body.status === 'Selected') {
                    sendSelectionEmail(candidate);
                } else if (req.body.status === 'Rejected') {
                    sendRejectionEmail(candidate);
                }
            }
        }

        // Add Notification for Interview Update (if status didn't change but interview did)
        if (req.body.interview && req.body.status !== 'Interview') {
             db.candidates[index].notifications.push({
                id: Date.now().toString() + '-int',
                type: 'Interview Update',
                message: `Interview details updated: ${req.body.interview.date} at ${req.body.interview.time}.`,
                link: req.body.interview.link,
                date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
            });
        }

        writeDB(db);
        res.json(db.candidates[index]);
    } else {
        res.status(404).json({ error: 'Candidate not found' });
    }
};

const deleteCandidate = (req, res) => {
    const { id } = req.params;
    const db = readDB();
    db.candidates = db.candidates.filter(c => c.id !== id);
    writeDB(db);
    res.status(204).send();
};

const rankCandidates = (req, res) => {
    const { role } = req.body;
    const db = readDB();
    
    // Sort candidates by score descending
    const ranked = [...db.candidates].sort((a, b) => (b.score || 0) - (a.score || 0));
    
    res.json(ranked);
};

const generateInterviewToken = (req, res) => {
    const { candidateId } = req.body;
    const db = readDB();
    const index = db.candidates.findIndex(c => c.id === candidateId);

    if (index === -1) {
        return res.status(404).json({ error: 'Candidate not found' });
    }

    // Generate fixed unique token if not exists
    if (!db.candidates[index].interview || !db.candidates[index].interview.token) {
        const token = crypto.randomBytes(16).toString('hex');
        db.candidates[index].interview = {
            ...(db.candidates[index].interview || {}),
            token
        };
        writeDB(db);
    }

    res.json({ token: db.candidates[index].interview.token });
};

const validateToken = (req, res) => {
    const { token } = req.params;
    const db = readDB();
    const candidate = db.candidates.find(c => c.interview && c.interview.token === token);

    if (!candidate) {
        return res.status(404).json({ error: 'Invalid or expired interview link' });
    }

    res.json({
        candidateName: candidate.name,
        role: candidate.role,
        interview: candidate.interview
    });
};

module.exports = {
    getCandidates,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    rankCandidates,
    generateInterviewToken,
    validateToken
};

