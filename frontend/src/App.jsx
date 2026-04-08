import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Core Shell Components
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';

// View Components
import DashboardView from './components/DashboardView';
import AnalyzerView from './components/AnalyzerView';
import JobMatcherView from './components/JobMatcherView';
import ProfileView from './components/ProfileView';
import ReportsView from './components/ReportsView';
import InboxView from './components/InboxView';
import LandingPage from './components/LandingPage';
import InterviewPage from './components/InterviewPage';
import LoginModal from './components/LoginModal';
import InterviewRoomView from './components/InterviewRoomView';

import SignInRequiredModal from './components/SignInRequiredModal';
import SplashScreen from './components/SplashScreen';
import ResumeAlreadyExistsModal from './components/ResumeAlreadyExistsModal';
import ChatWidget from './components/ChatWidget';
import ResumeBuilderModal from './components/ResumeBuilderModal';
import ResumeUploadWorkflow from './components/ResumeUploadWorkflow';
import HRResumeVault from './components/HRResumeVault';

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [appEntered, setAppEntered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');

  const [recruiterMode, setRecruiterMode] = useState(false);
  const [results, setResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Frontend');
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  const [showResumeUploadWorkflow, setShowResumeUploadWorkflow] = useState(false);
  const [interviewToken, setInterviewToken] = useState(null);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Restore Session on Mount
  useEffect(() => {
    const savedUser = localStorage.getItem('userdb');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
        // setAppEntered(true); <- Removed to ensure Landing Page shows first
      } catch (e) {
        console.error('Failed to restore session:', e);
        localStorage.removeItem('userdb');
      }
    }
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      if (path.startsWith('/interview/')) {
        const token = path.split('/interview/')[1];
        if (token) {
          setInterviewToken(token);
          setActiveView('interview');
          setAppEntered(true);
        }
      } else if (path.startsWith('/interview-room/')) {
        const roomId = path.split('/interview-room/')[1];
        if (roomId) {
          setActiveRoomId(roomId);
          setActiveView('interview-room');
          setAppEntered(true);
        }
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, []);


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleUpload = (file, role = 'Frontend', isBulk = false) => {
    // Duplicate Detection Logic
    const filesToCheck = Array.isArray(file) ? file : [file];
    const isDuplicate = filesToCheck.some(newFile => 
      uploadedResumes.some(existing => 
        existing.name === newFile.name && existing.size === newFile.size
      )
    );

    if (isDuplicate) {
      setShowDuplicateModal(true);
      return;
    }

    // If not duplicate, add to historical list
    const newEntries = filesToCheck.map(f => ({ name: f.name, size: f.size }));
    setUploadedResumes(prev => [...prev, ...newEntries]);

    if (!isLoggedIn) {
      setPendingFile(file);
      setSelectedRole(role);
      setRecruiterMode(isBulk);
      setShowSignInPrompt(true);
      return;
    }
    setResults(null);
    setResumeText('');
    setResumeName('');
    setAppEntered(true);
    setPendingFile(file);
    setSelectedRole(role);
    setRecruiterMode(isBulk);
    setActiveView('analyzer');
  };

  const handleEnterApp = (forceLogin = false) => {
    if (!isLoggedIn) {
      setShowSignInPrompt(true);
      return;
    }
    if (forceLogin) {
      setShowLoginModal(true);
      return;
    }
    setAppEntered(true);
  };

  const handleUpdateUser = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  const handleLogin = (data) => {
    // New Rules:
    // 1. Username is compulsory and must start with a capital letter
    // 2. Password must be 'password'
    const isUsernameValid = data.username && /^[A-Z]/.test(data.username);
    const isPasswordValid = data.password === 'password';

    if (isUsernameValid && isPasswordValid) {
      console.log('Login successful');
      
      const roleToAssign = ['admin', 'hr', 'recruiter'].includes(data.username.toLowerCase()) ? 'HR' : 'Employee';
      
      // Simple gender detection heuristic for demo
      const femaleNames = ['Pooja', 'Agila', 'Jane', 'Sophia', 'Emma', 'Isabella', 'Mia', 'Agila'];
      const isFemale = femaleNames.some(n => data.username.toLowerCase() === n.toLowerCase()) || data.username.toLowerCase().endsWith('a') || data.username.toLowerCase().endsWith('i');
      
      const avatarUrl = isFemale 
        ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80";

      const userData = { 
        name: data.username,
        avatar: avatarUrl,
        userRole: roleToAssign,
        role: roleToAssign === 'HR' ? 'Recruiter' : 'Frontend Developer',
        email: `${data.username.toLowerCase()}@example.com`,
        phone: '+1 123 456 7890',
        membership: roleToAssign === 'HR' ? 'Elite Member' : 'Standard Member'
      };

      setUser(userData);
      localStorage.setItem('userdb', JSON.stringify(userData));
      if (roleToAssign === 'HR') {
        localStorage.setItem('hrdb', JSON.stringify(userData));
      }
      
      // Force recruiter mode off for everyone initially, or strictly off for employees
      setRecruiterMode(false);
      
      setIsLoggedIn(true);
      setLoginError(null);
      setShowLoginModal(false);
      setAppEntered(true);
      if (pendingFile) {
        setActiveView('analyzer');
      }
    } else {
      if (!isUsernameValid) {
        setLoginError('Username must start with a capital letter');
      } else {
        setLoginError('Incorrect password');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setAppEntered(false);
    setRecruiterMode(false);
    setActiveView('dashboard');
    localStorage.removeItem('userdb');
    localStorage.removeItem('hrdb');
    console.log('User logged out and session db cleared');
  };

  const [recentAnalyses, setRecentAnalyses] = useState([
    { 
      name: "Pratik_Sharma_Resume.pdf", 
      role: "Frontend Developer", 
      score: 92, 
      matchPercentage: 88, 
      date: "10:30 AM", 
      status: "Selected",
      matchedSkills: ["React.js", "TypeScript", "Framer Motion", "Tailwind CSS"]
    },
    { 
      name: "Anjali_Rao_Backend.docx", 
      role: "Node.js Developer", 
      score: 75, 
      matchPercentage: 72, 
      date: "09:45 AM", 
      status: "Consider",
      matchedSkills: ["Node.js", "PostgreSQL", "Redis"]
    },
    { 
      name: "Rahul_Mehta_Sales.pdf", 
      role: "Sales Executive", 
      score: 45, 
      matchPercentage: 30, 
      date: "Yesterday", 
      status: "Rejected",
      matchedSkills: ["CRMs", "Communication"]
    }
  ]);
  
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dbError, setDbError] = useState(null);

  const fetchRecentAnalyses = async () => {
    setIsDataLoading(true);
    setDbError(null);
    try {
      const response = await fetch('/api/candidates');
      if (response.status === 503) {
        console.error("DATABASE OFFLINE: MONGODB_URI is likely missing from Vercel environment variables.");
        setDbError("Database Disconnected. Please check Vercel environment variables.");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const formatted = data.map(cand => ({
            id: cand._id || cand.id,
            name: cand.name,
            fileName: cand.fileName || '',
            role: cand.role || 'General',
            score: cand.score || 0,
            matchPercentage: cand.matchPercentage || 0,
            matchedSkills: cand.matchedSkills || [],
            missingSkills: cand.missingSkills || [],
            skills: cand.skills || [],
            strengths: cand.strengths || [],
            weaknesses: cand.weaknesses || [],
            reasons: cand.reasons || [],
            extractedText: cand.extractedText || '',
            status: cand.status || 'Applied',
            timestamp: cand.timestamp || cand.updatedAt || new Date().toISOString(),
            date: cand.timestamp ? new Date(cand.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Today'
          })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
          setRecentAnalyses(formatted.slice(0, 15));
        }
      }
    } catch (err) {
      console.error('Failed to sync dashboard data:', err);
      setDbError("Unable to connect to service.");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (appEntered) {
       fetchRecentAnalyses();
    }
  }, [appEntered]);
  
  const handleSelectCandidate = (candidate) => {
    setResults(candidate);
    setResumeName(candidate.fileName || candidate.name);
    setResumeText(candidate.extractedText || "No extractable text found.");
    setActiveView('analyzer');
  };

  const handleAnalysisComplete = async (data, fileName) => {
    setResults(data);
    if (data.extractedText) setResumeText(data.extractedText);
    if (fileName) setResumeName(fileName);
    
    // Persist to backend to trigger notifications & mail
    try {
      let candidateName = data.name;
      if (!candidateName && data.firstName && data.lastName) {
        candidateName = `${data.firstName} ${data.lastName}`;
      }
      if (!candidateName && user && user.name) {
        candidateName = user.name;
      }
      if (!candidateName && fileName) {
        candidateName = fileName.split('.')[0];
      }
      if (!candidateName) {
        candidateName = "Untitled Analysis";
      }

      const cand = {
        name: candidateName,
        fileName: fileName,
        score: data.score || 0,
        matchPercentage: data.matchPercentage || 0,
        matchedSkills: data.matchedSkills || [],
        skills: data.skills || [],
        missingSkills: data.missingSkills || [],
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        reasons: data.reasons || [],
        status: data.verdict || 'Consider',
        role: data.role || selectedRole || 'General',
        email: user?.email || 'N/A',
        extractedText: data.extractedText || ''
      };

      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cand)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save candidate: ${response.statusText}`);
      }
      
      const savedCand = await response.json();
      console.log('Single analysis persisted:', savedCand.name, '(ID:', savedCand._id || savedCand.id, ')');
      
      // Auto-refresh after persistence
      await fetchRecentAnalyses();
    } catch (err) {
      console.error('Failed to persist single analysis:', err);
    }

    setActiveView('analyzer');
  };

  const handleBatchComplete = (batchResults) => {
    const dashboardEntries = batchResults.map(data => ({
      id: data.id || Date.now().toString(),
      name: data.name || data.fileName?.split('.')[0] || "Untitled Analysis",
      fileName: data.fileName || "",
      role: data.role || "General",
      score: data.score || 0,
      matchPercentage: data.matchPercentage || 0,
      matchedSkills: data.matchedSkills || [],
      missingSkills: data.missingSkills || [],
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      reasons: data.reasons || [],
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: data.status || data.verdict || "Consider"
    }));
    setRecentAnalyses(prev => [...dashboardEntries, ...prev].slice(0, 20));
  };

  useEffect(() => {
    if (appEntered) {
      document.body.classList.add('app-mode');
    } else {
      document.body.classList.remove('app-mode');
    }
  }, [appEntered]);

  const clearResults = () => {
    setResults(null);
    setResumeText('');
    setResumeName('');
  };

  const handleReset = () => {
    clearResults();
    setActiveView('dashboard');
  };

  const handleViewChange = (view) => {
    if (view === 'dashboard' || view === 'vault') {
      fetchRecentAnalyses();
    }
    setActiveView(view);
  };

  return (
    <>
      <AnimatePresence>
        {activeView === 'interview-room' && (
          <motion.div key="room-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
             <InterviewRoomView roomId={activeRoomId} user={user} onExit={() => setActiveView('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>

      <ChatWidget />

      <AnimatePresence mode="wait">
        {showSplash || isInitializing ? (
          <SplashScreen key="splash" onComplete={() => setTimeout(() => setShowSplash(false), 2500)} />
        ) : !appEntered ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ position: 'relative', width: '100%' }}>
              <LandingPage
                onUpload={handleUpload}
                analyzing={analyzing}
                onEnterApp={handleEnterApp}
                onPrompt={setShowSignInPrompt}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="app"
            className="main-wrapper"
            style={{ position: 'relative', overflow: 'hidden' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sidebar 
              activeView={activeView} 
              setActiveView={handleViewChange} 
              recruiterMode={recruiterMode}
              user={user}
              onLogout={handleLogout}
              setRecruiterMode={(val) => {
                setRecruiterMode(val);
                if (val) setActiveView('analyzer');
              }} 
            />
            
            <div className="content-area">
              <TopHeader 
                recruiterMode={recruiterMode} 
                user={user} 
                darkMode={darkMode} 
                onToggleDark={() => setDarkMode(d => !d)} 
                onLogout={handleLogout}
                style={{ position: 'relative', zIndex: 10 }} 
              />
              
              <main className="view-container" style={{ position: 'relative', zIndex: 10 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ height: '100%' }}
                  >
                    {activeView === 'dashboard' && (
                      <DashboardView 
                        user={user} 
                        recentAnalyses={recentAnalyses}
                        setActiveView={handleViewChange} 
                        setRecruiterMode={setRecruiterMode} 
                        recruiterMode={recruiterMode}
                        onRefresh={fetchRecentAnalyses}
                        onUploadNew={() => setShowResumeUploadWorkflow(true)}
                        onSelectCandidate={handleSelectCandidate}
                        isLoading={isDataLoading}
                        dbError={dbError}
                      />
                    )}
                    {activeView === 'analyzer' && (
                      <AnalyzerView 
                        results={results} 
                        analyzing={analyzing} 
                        setAnalyzing={setAnalyzing}
                        onAnalysisComplete={handleAnalysisComplete}
                        onBatchComplete={handleBatchComplete}
                        onReset={handleReset}
                        clearResults={clearResults}
                        recruiterMode={recruiterMode}
                        setRecruiterMode={setRecruiterMode}
                        initialFile={pendingFile}
                        initialRole={selectedRole}
                        onUpdateUser={handleUpdateUser}
                        onSetRole={setSelectedRole}
                        setResults={setResults}
                        setResumeText={setResumeText}
                        setResumeName={setResumeName}
                        uploadedResumes={uploadedResumes}
                        setUploadedResumes={setUploadedResumes}
                        setShowDuplicateModal={setShowDuplicateModal}
                        user={user}
                      />
                    )}
                    {activeView === 'matcher' && <JobMatcherView resumeText={resumeText} resumeName={resumeName} setActiveView={setActiveView} />}
                    {activeView === 'profile' && <ProfileView user={user} onUpdateUser={handleUpdateUser} />}
                    {activeView === 'reports' && <ReportsView recentAnalyses={recentAnalyses} />}
                    {activeView === 'mail' && <InboxView setActiveView={setActiveView} />}
                    {activeView === 'interview' && <InterviewPage token={interviewToken} />}
                    {activeView === 'vault' && <HRResumeVault />}
                  </motion.div>

                </AnimatePresence>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SignInRequiredModal 
        isOpen={showSignInPrompt} 
        onClose={() => setShowSignInPrompt(false)} 
        onSignIn={() => {
          setShowSignInPrompt(false);
          setShowLoginModal(true);
        }} 
      />

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => {
          setShowLoginModal(false);
          setLoginError(null);
        }} 
        onLogin={handleLogin}
        error={loginError}
      />

      <ResumeAlreadyExistsModal 
        isOpen={showDuplicateModal} 
        onClose={() => setShowDuplicateModal(false)}
        onConfirm={() => setShowDuplicateModal(false)}
      />

      <ResumeBuilderModal 
        isOpen={showResumeBuilder} 
        onClose={() => setShowResumeBuilder(false)}
        onComplete={() => {
          fetchRecentAnalyses();
          setActiveView('analyzer');
        }}
      />

      <ResumeUploadWorkflow 
        isOpen={showResumeUploadWorkflow} 
        onClose={() => setShowResumeUploadWorkflow(false)}
        onComplete={({ analysisResults, fileName, formData }) => {
          if (analysisResults) {
            // Priority: User Edited Fields (personal) > Analysis Results
            const finalData = { ...analysisResults, ...formData?.personal };
            handleAnalysisComplete(finalData, fileName);
          } else {
            fetchRecentAnalyses();
            setActiveView('analyzer');
          }
        }}
      />
    </>
  );
}

export default App;
