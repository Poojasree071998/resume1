const express = require("express");
const multer = require("multer");
const Resume = require("../models/Resume");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const router = express.Router();

const DB_PATH = path.join(__dirname, '../data/resumes.json');
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

const getLocalData = () => {
    if (!fs.existsSync(DB_PATH)) return [];
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data || '[]');
    } catch (e) { return []; }
};

const saveLocalData = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

const isDBConnected = () => mongoose.connection.readyState === 1;

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// @route POST /api/upload-resume
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    const { employeeName, email } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const resumeData = {
      employeeName,
      email,
      fileName: req.file.filename,
      filePath: req.file.path.replace(/\\/g, '/'), // Normalize path for web
      uploadDate: new Date(),
    };

    if (isDBConnected()) {
        const newResume = new Resume(resumeData);
        await newResume.save();
        return res.status(200).json({ success: true, message: "Resume saved to MongoDB", data: newResume });
    } else {
        const locals = getLocalData();
        const newResume = { _id: Date.now().toString(), ...resumeData };
        locals.push(newResume);
        saveLocalData(locals);
        return res.status(200).json({ success: true, message: "Resume saved locally (DB offline)", data: newResume });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
});

// @route GET /api/resumes
router.get("/resumes", async (req, res) => {
  try {
    if (isDBConnected()) {
        const resumes = await Resume.find().sort({ uploadDate: -1 });
        return res.status(200).json(resumes);
    }
    const resumes = getLocalData().sort((a,b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    res.status(200).json(resumes);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch resumes", error: error.message });
  }
});

module.exports = router;

module.exports = router;
