const mongoose = require('mongoose');
const Candidate = require('../models/Candidate');
const crypto = require('crypto');
const { sendUploadConfirmation, sendInterviewEmail, sendSelectionEmail, sendRejectionEmail } = require('../utils/emailService');

// DB persistence is now managed by Mongoose/MongoDB

const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({}).sort({ createdAt: -1 });
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: 'Failed to fetch candidates' });
    }
};

const addCandidate = async (req, res) => {
    try {
        const status = req.body.status || 'Applied';
        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
        
        const notifications = [
            {
                id: `${Date.now()}-1`,
                type: 'Confirmation',
                message: 'Application received successfully. AI initial screening in progress.',
                date: timestamp
            }
        ];

        if (status === 'Selected') {
            notifications.push({
                id: `${Date.now()}-2`,
                type: 'Selected',
                message: 'Congratulations! You have been selected for the next round.',
                date: timestamp
            });
        } else if (status === 'Rejected') {
            notifications.push({
                id: `${Date.now()}-2`,
                type: 'Rejected',
                message: 'Thank you for your interest. Unfortunately, we will not be moving forward with your application.',
                date: timestamp
            });
        }

        const newCandidate = await Candidate.create({
            ...req.body,
            status,
            notifications
        });

        if (newCandidate.email && newCandidate.email !== 'candidate@example.com') {
            try {
                await sendUploadConfirmation(newCandidate);
            } catch (err) {
                console.error('Email confirmation failed (continuing):', err.message);
            }
        }

        res.status(201).json(newCandidate);
    } catch (error) {
        console.error('Error adding candidate:', error);
        res.status(500).json({ error: 'Failed to add candidate', details: error.message });
    }
};

const updateCandidate = async (req, res) => {
    const { id } = req.params;
    try {
        const candidate = await Candidate.findById(id);
        if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

        const oldStatus = candidate.status;
        const newStatus = req.body.status || oldStatus;
        
        // Update candidate fields
        Object.assign(candidate, req.body);
        
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

            candidate.notifications.push({
                id: Date.now().toString(),
                type: req.body.status,
                message,
                link,
                date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
            });

            // Trigger Emails
            if (candidate.email && candidate.email !== 'candidate@example.com') {
                try {
                    if (req.body.status === 'Interview') {
                        if (!candidate.interview?.token) {
                            candidate.interview = candidate.interview || {};
                            candidate.interview.token = crypto.randomBytes(16).toString('hex');
                        }
                        await sendInterviewEmail(candidate, candidate.interview);
                    } else if (req.body.status === 'Selected') {
                        await sendSelectionEmail(candidate);
                    } else if (req.body.status === 'Rejected') {
                        await sendRejectionEmail(candidate);
                    }
                } catch (emailErr) {
                    console.error('Email trigger failed:', emailErr.message);
                }
            }
        }

        await candidate.save();
        res.json(candidate);
    } catch (error) {
        console.error('Error updating candidate:', error);
        res.status(500).json({ error: 'Failed to update candidate' });
    }
};

const deleteCandidate = async (req, res) => {
    const { id } = req.params;
    try {
        await Candidate.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete candidate' });
    }
};

const rankCandidates = async (req, res) => {
    try {
        const ranked = await Candidate.find({}).sort({ score: -1 });
        res.json(ranked);
    } catch (error) {
        res.status(500).json({ error: 'Failed to rank candidates' });
    }
};

const generateInterviewToken = async (req, res) => {
    const { candidateId } = req.body;
    try {
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

        if (!candidate.interview?.token) {
            candidate.interview = candidate.interview || {};
            candidate.interview.token = crypto.randomBytes(16).toString('hex');
            await candidate.save();
        }
        res.json({ token: candidate.interview.token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate token' });
    }
};

const validateToken = async (req, res) => {
    const { token } = req.params;
    try {
        const candidate = await Candidate.findOne({ 'interview.token': token });
        if (!candidate) return res.status(404).json({ error: 'Invalid link' });

        res.json({
            candidateName: candidate.name,
            role: candidate.role,
            interview: candidate.interview
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to validate token' });
    }
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

