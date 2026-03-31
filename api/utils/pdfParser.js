const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const extractTextFromPDF = async (buffer) => {
    try {
        if (!buffer || buffer.length === 0) return "";
        const data = await pdfParse(buffer);
        return data.text || "";
    } catch (error) {
        console.error('Error parsing PDF:', error);
        // Returning empty string instead of throwing prevents a total analysis crash
        return "";
    }
};

const extractTextFromDOCX = async (buffer) => {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        console.error('Error parsing DOCX:', error);
        throw new Error('Failed to parse DOCX');
    }
};

module.exports = {
    extractTextFromPDF,
    extractTextFromDOCX
};
