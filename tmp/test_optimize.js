const { optimizeResume } = require('./backend/utils/aiPrompt');

const dummyAnalysis = {
    score: 85,
    matchPercentage: 90,
    missingSkills: ['Kubernetes'],
    extractedText: "John Doe\nFrontend Developer\nReact, JavaScript"
};

try {
    const result = optimizeResume(dummyAnalysis, 'Frontend', '');
    console.log('Success!');
} catch (e) {
    console.error('CRASH:', e);
}
