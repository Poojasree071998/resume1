const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  email: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Resume", ResumeSchema);
