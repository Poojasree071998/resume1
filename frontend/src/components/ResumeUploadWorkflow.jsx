import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Sparkles,
  Download,
  Layout as LayoutIcon,
  Globe,
  FileCheck,
  Zap,
  Info,
  Check
} from 'lucide-react';
import ModernResumeTemplate from './ModernResumeTemplate';
import ForgeLogo from './ForgeLogo';

const ResumeUploadWorkflow = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('Modern');
  const [activeTab, setActiveTab] = useState('All Templates');
  
  const [formData, setFormData] = useState({
    personal: {
      firstName: 'Vikram',
      lastName: 'L',
      jobTitle: 'Mobile Developer',
      phone: '+91 9876543210',
      email: 'vikram.l@example.com',
      additionalInfo: ''
    }
  });

  // Step 1 Simulation: Processing
  useEffect(() => {
    if (isOpen && step === 1) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, [name]: value }
    }));
  };

  const templates = [
    { name: 'Simple', tag: 'Simple' },
    { name: 'Modern', tag: 'Modern' },
    { name: 'Professional', tag: 'Professional' },
    { name: 'One Column', tag: 'One column' },
    { name: 'ATS-friendly', tag: 'ATS' }
  ];

  const tabs = ['All Templates', 'Simple', 'Modern', 'One column', 'With photo', 'Professional', 'ATS'];

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 10002, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'rgba(5, 10, 25, 0.7)', 
      backdropFilter: 'blur(12px)' 
    }}>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          width: step === 4 ? '1100px' : '760px',
          height: step === 4 ? '780px' : 'auto',
          minHeight: step === 1 ? '400px' : '500px',
          background: 'var(--bg-card)',
          borderRadius: '32px',
          border: '1px solid var(--border)',
          boxShadow: '0 50px 100px rgba(0,0,0,0.4)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', top: '24px', right: '24px', 
            background: 'rgba(255,255,255,0.05)', border: 'none', 
            color: 'var(--text-muted)', width: '36px', height: '36px', 
            borderRadius: '50%', cursor: 'pointer', zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        <AnimatePresence mode="wait">
          {/* STEP 1: PROCESSING */}
          {step === 1 && (
            <motion.div 
              key="step1" 
              variants={stepVariants} 
              initial="initial" 
              animate="animate" 
              exit="exit"
              style={{ padding: '6rem 3rem', textAlign: 'center' }}
            >
              <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2.5rem' }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <motion.circle 
                    cx="40" cy="40" r="36" fill="none" 
                    stroke="var(--primary)" strokeWidth="4" 
                    strokeDasharray="226"
                    initial={{ strokeDashoffset: 226 }}
                    animate={{ strokeDashoffset: [226, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-main)' }}>Processing...</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500, maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
                Please wait while our artificial intelligence processes the information from your resume and selects the right fields
              </p>
            </motion.div>
          )}

          {/* STEP 2: SUCCESS UPLOADED */}
          {step === 2 && (
            <motion.div 
              key="step2" 
              variants={stepVariants} 
              initial="initial" 
              animate="animate" 
              exit="exit"
              style={{ padding: '0 0 4rem 0', textAlign: 'center', display: 'flex', flexDirection: 'column' }}
            >
               <div style={{ 
                 height: '240px', background: 'linear-gradient(180deg, rgba(0, 102, 204, 0.1) 0%, transparent 100%)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
               }}>
                 <div style={{ position: 'relative' }}>
                    <div style={{ width: '120px', height: '160px', borderRadius: '12px', background: 'white', opacity: 0.1, transform: 'rotate(-5deg) translateX(-20px)' }} />
                    <div style={{ width: '120px', height: '160px', borderRadius: '12px', background: 'white', position: 'absolute', top: 0, left: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Check size={30} />
                       </div>
                    </div>
                 </div>
                 {/* Sparkles */}
                 <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', top: '40%', right: '35%' }}><Sparkles size={24} color="var(--primary)"/></motion.div>
                 <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} style={{ position: 'absolute', bottom: '30%', left: '35%' }}><Sparkles size={20} color="var(--primary)"/></motion.div>
               </div>
               
               <div style={{ padding: '0 3rem' }}>
                 <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Resume uploaded successfully</h2>
                 <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '2.5rem' }}>
                   Edit and improve your resume with our AI-powered builder.
                 </p>
                 <button 
                  onClick={() => setStep(3)}
                  className="glass-btn btn-primary"
                  style={{ padding: '1rem 4rem', fontSize: '1.1rem', fontWeight: 900, borderRadius: '16px' }}
                 >
                   Start Editing
                 </button>
               </div>
            </motion.div>
          )}

          {/* STEP 3: TEMPLATE SELECTION */}
          {step === 3 && (
            <motion.div 
              key="step3" 
              variants={stepVariants} 
              initial="initial" 
              animate="animate" 
              exit="exit"
              style={{ padding: '3.5rem 3rem', textAlign: 'center' }}
            >
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Resume templates</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500, marginBottom: '1.5rem' }}>
                Simple to use and ready in minutes resume templates — give it a try for free now!
              </p>
              <button 
                onClick={() => setStep(4)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', marginBottom: '3rem' }}
              >
                Choose later
              </button>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                {tabs.map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{ 
                      padding: '0.6rem 1.25rem', borderRadius: '12px', border: 'none',
                      background: activeTab === tab ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                      color: activeTab === tab ? 'white' : 'var(--text-muted)',
                      fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      transition: 'all 0.2s',
                      boxShadow: activeTab === tab ? '0 10px 20px var(--primary-glow)' : 'none'
                    }}
                  >
                    {tab === 'All Templates' && <LayoutIcon size={16} />}
                    {tab === 'ATS' && <FileCheck size={16} />}
                    {tab}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {templates.map(t => (
                  <motion.div 
                    key={t.name}
                    whileHover={{ y: -10 }}
                    onClick={() => { setSelectedTemplate(t.name); setStep(4); }}
                    style={{ 
                      background: 'rgba(255,255,255,0.02)', 
                      borderRadius: '24px', 
                      border: selectedTemplate === t.name ? '2px solid var(--primary)' : '1px solid var(--border)',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{ height: '180px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <FileCheck size={48} color="rgba(255,255,255,0.1)" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{t.name}</span>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {selectedTemplate === t.name && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: EDITING & PREVIEW */}
          {step === 4 && (
            <motion.div 
              key="step4" 
              variants={stepVariants} 
              initial="initial" 
              animate="animate" 
              exit="exit"
              style={{ flex: 1, display: 'flex', overflow: 'hidden' }}
            >
              {/* Left Column: Form */}
              <div style={{ flex: 0.6, padding: '3.5rem', overflowY: 'auto', borderRight: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem', color: 'var(--text-main)' }}>Contacts</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, marginBottom: '2.5rem', lineHeight: 1.5 }}>
                  Add your up-to-date contact information so employers and recruiters can easily reach you.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>First name</label>
                    <input 
                      name="firstName" 
                      value={formData.personal.firstName} 
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} 
                    />
                  </div>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Last name</label>
                    <input 
                      name="lastName" 
                      value={formData.personal.lastName} 
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} 
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Desired job title</label>
                  <input 
                    name="jobTitle" 
                    value={formData.personal.jobTitle} 
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Phone</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <div style={{ padding: '0 1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>
                          <span>🇮🇳</span> <ChevronDown size={14} /> +91
                       </div>
                       <input 
                        name="phone" 
                        value={formData.personal.phone.replace('+91 ', '')} 
                        onChange={(e) => setFormData(p => ({ ...p, personal: { ...p.personal, phone: '+91 ' + e.target.value } }))}
                        style={{ flex: 1, padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} 
                       />
                    </div>
                  </div>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Email</label>
                    <input 
                      name="email" 
                      value={formData.personal.email} 
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', marginBottom: '4rem' }}>
                  Additional information <ChevronDown size={18} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => setStep(5)}
                    className="glass-btn btn-primary"
                    style={{ padding: '1rem 3rem', fontSize: '1rem', fontWeight: 900, borderRadius: '16px' }}
                  >
                    Next: Experience
                  </button>
                </div>
              </div>

              {/* Right Column: Preview */}
              <div style={{ flex: 0.4, background: 'rgba(255,255,255,0.015)', padding: '2.5rem', overflow: 'hidden', position: 'relative' }}>
                {/* Score Badge */}
                <div style={{ 
                  position: 'absolute', top: '24px', left: '24px', zIndex: 5,
                  padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--border)', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', fontWeight: 800
                }}>
                  <div style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>60%</div>
                  Your resume score <span style={{ fontSize: '1rem' }}>🤩</span>
                </div>

                {/* Resume Mockup */}
                <div style={{ 
                  background: 'white', height: '100%', borderRadius: '4px', boxAlpha: '0.1', 
                  transform: 'scale(1)', transformOrigin: 'top center',
                  display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
                }}>
                   <div style={{ display: 'flex', height: '100%' }}>
                      <div style={{ flex: 0.35, background: '#f8fafc', padding: '3rem 1.5rem', borderRight: '1px solid #e2e8f0' }}>
                         <div style={{ marginBottom: '2rem' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.25rem', textTransform: 'uppercase' }}>{formData.personal.firstName} {formData.personal.lastName}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{formData.personal.jobTitle}</div>
                         </div>
                         <div style={{ marginBottom: '2rem' }}>
                            <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>Details</div>
                            <div style={{ fontSize: '0.7rem', color: '#334155', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Mail size={10} color="#6366f1" /> {formData.personal.email}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#334155', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Phone size={10} color="#6366f1" /> {formData.personal.phone}
                            </div>
                         </div>
                         <div>
                            <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>Skills</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                               {['Flutter', 'Dart', 'React Native'].map(s => <div key={s} style={{ fontSize: '0.7rem', color: '#334155', fontWeight: 600 }}>• {s}</div>)}
                            </div>
                         </div>
                      </div>
                      <div style={{ flex: 0.65, padding: '3rem 2rem' }}>
                         <div style={{ marginBottom: '2rem' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '1rem' }}>Education</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>Bachelor of Computer Applications</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>University of Madras</div>
                         </div>
                         <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '1rem' }}>Projects</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>AI Resume Analyzer</div>
                            <p style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.4rem', lineHeight: 1.5 }}>Developed a high-fidelity AI powered resume reconstruction platform.</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: FINAL SUCCESS */}
          {step === 5 && (
            <motion.div 
              key="step5" 
              variants={stepVariants} 
              initial="initial" 
              animate="animate" 
              exit="exit"
              style={{ padding: '0 0 4rem 0', textAlign: 'center', display: 'flex', flexDirection: 'column' }}
            >
               <div style={{ 
                 height: '240px', background: 'linear-gradient(180deg, rgba(244, 196, 0, 0.1) 0%, transparent 100%)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
               }}>
                 <div style={{ position: 'relative' }}>
                    <div style={{ width: '120px', height: '160px', borderRadius: '12px', background: 'white', opacity: 0.05, transform: 'rotate(10deg) translateX(40px) translateY(20px)' }} />
                    <div style={{ width: '120px', height: '160px', borderRadius: '12px', background: 'white', opacity: 0.1, transform: 'rotate(-5deg) translateX(-20px)' }} />
                    <div style={{ width: '130px', height: '170px', borderRadius: '12px', background: 'white', position: 'absolute', top: -5, left: 5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
                       <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '8px' }} />
                       <div style={{ width: '60%', height: '8px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '12px' }} />
                       <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                          {[1,2,3,4,5].map(i => <div key={i} style={{ width: '16px', height: '16px', borderRadius: '50%', background: i===1 ? '#3b82f6' : i===2 ? '#10b981' : i===3 ? '#f59e0b' : '#f1f5f9' }} />)}
                       </div>
                       <div style={{ marginTop: 'auto', width: '100%', height: '24px', background: 'var(--primary)', borderRadius: '6px' }} />
                    </div>
                 </div>
                 {/* Sparkles */}
                 <motion.div animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', top: '30%', left: '30%' }}><Sparkles size={32} color="#F4C400"/></motion.div>
                 <motion.div animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }} style={{ position: 'absolute', bottom: '25%', right: '35%' }}><Sparkles size={24} color="#F4C400"/></motion.div>
               </div>
               
               <div style={{ padding: '0 3rem' }}>
                 <h2 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Great work!</h2>
                 <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '2.5rem' }}>
                   Your resume is looking great — download it and start applying.
                 </p>
                 <button 
                  onClick={() => { onComplete(formData); onClose(); setStep(1); }}
                  className="glass-btn btn-primary"
                  style={{ padding: '1rem 5rem', fontSize: '1.1rem', fontWeight: 900, borderRadius: '16px' }}
                 >
                   Continue
                 </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Internal Helper
const ChevronDown = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export default ResumeUploadWorkflow;
