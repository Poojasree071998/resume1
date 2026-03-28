import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ForgeLogo from './ForgeLogo';
import { Upload, Zap, Target, BarChart3, Lightbulb, FileText, ChevronRight, Globe, BrainCircuit, Shield, TrendingUp,  Search, 
  CheckCircle, 
  Server, 
  Cpu, 
  ArrowRight, 
  Sparkles,
  Mail,
  Award,
  Twitter,
  Linkedin,
  Github,
  Settings
} from 'lucide-react';

const BackgroundParticles = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {[...Array(20)].map((_, i) => (
      <motion.div 
        key={i}
        animate={{ 
          y: [0, -100, 0], 
          x: [0, Math.random() * 50 - 25, 0],
          opacity: [0, 0.3, 0] 
        }}
        transition={{ 
          duration: 10 + Math.random() * 10, 
          repeat: Infinity, 
          delay: Math.random() * 10 
        }}
        style={{ 
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: '2px',
          height: '2px',
          background: 'rgba(255,255,255,0.4)',
          borderRadius: '50%'
        }}
      />
    ))}
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ 
      y: -12, 
      scale: 1.02,
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4), 0 0 20px rgba(13, 110, 253, 0.15)'
    }}
    transition={{ 
      type: "spring", 
      stiffness: 300, 
      damping: 20, 
      delay: delay 
    }}
    viewport={{ once: true }}
    className="glass-card"
    style={{ 
      padding: '2.5rem', 
      textAlign: 'left',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      cursor: 'pointer'
    }}
  >
    <div style={{ width: 56, height: 56, background: 'rgba(244, 196, 0, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', marginBottom: '2rem', filter: 'drop-shadow(0 0 10px rgba(244, 196, 0, 0.2))' }}>
      <Icon size={28} strokeWidth={2.5} />
    </div>
    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', color: '#ffffff', letterSpacing: '-0.02em' }}>{title}</h3>
    <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>{desc}</p>
  </motion.div>
);

const RoleCard = ({ role, icon: Icon, active, onClick }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ 
      scale: 1.08, 
      y: -8,
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)'
    }}
    whileTap={{ scale: 0.92 }}
    onClick={() => onClick(role)}
    style={{
      padding: '1.25rem 1rem',
      borderRadius: '20px',
      border: active ? '2.5px solid var(--secondary)' : '1px solid rgba(255,255,255,0.15)',
      background: active ? 'rgba(244, 196, 0, 0.1)' : 'rgba(255,255,255,0.03)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      minWidth: '120px',
      boxShadow: active ? '0 0 25px rgba(244, 196, 0, 0.2)' : 'none'
    }}
  >
    <div style={{ color: active ? 'var(--secondary)' : 'rgba(255,255,255,0.6)', filter: active ? 'drop-shadow(0 0 8px rgba(244, 196, 0, 0.4))' : 'none' }}>
      <Icon size={26} strokeWidth={2.5} />
    </div>
    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: active ? '#ffffff' : 'rgba(255,255,255,0.6)', letterSpacing: '0.02em' }}>{role}</span>
  </motion.button>
);

const RoadmapDecoration = ({ type }) => {
  const images = {
    skills: "/assets/landing/roadmap_specialization_1774686782593.png",
    radar: "/assets/landing/roadmap_radar_1774686806072.png",
    stream: "/assets/landing/roadmap_upload_1774686827206.png",
    neural: "/assets/landing/roadmap_brain_1774686850709.png",
    success: "/assets/landing/roadmap_success_1774686876776.png"
  };

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <div style={{ 
        position: 'absolute', inset: 0, 
        background: 'rgba(244, 196, 0, 0.05)', 
        filter: 'blur(60px)', 
        borderRadius: '50%',
        zIndex: 0
      }} />
      <img 
        src={images[type]} 
        alt={type} 
        style={{ 
          maxHeight: '320px', 
          maxWidth: '100%', 
          objectFit: 'contain', 
          zIndex: 1,
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' 
        }} 
      />
    </motion.div>
  );
};

const RoadmapStep = ({ number, title, children, layout, decorationType }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    style={{ 
      display: 'flex', 
      flexDirection: layout === 'right' ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4rem',
      marginBottom: '8rem',
      position: 'relative',
      minHeight: '400px'
    }}
  >
    {/* Content Side */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: layout === 'right' ? 'flex-start' : 'flex-end', textAlign: layout === 'right' ? 'left' : 'right' }}>
      <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>{title}</h3>
      <div className="glass-card" style={{ 
        padding: '2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)', borderRadius: '24px', maxWidth: '450px'
      }}>
        {children}
      </div>
    </div>

    {/* Center Spine with Number */}
    <div style={{ 
      position: 'relative', width: 80, height: '100%', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 5
    }}>
      <div style={{ 
        width: 2, height: '150%', borderLeft: '2px dashed rgba(244, 196, 0, 0.3)', 
        position: 'absolute', top: '-25%', left: '50%', transform: 'translateX(-50%)' 
      }} />
      <div style={{ 
        width: 80, height: 80, background: 'var(--grad-main)', borderRadius: '24px', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent)',
        boxShadow: '0 10px 30px rgba(244, 196, 0, 0.4)',
        position: 'relative', zIndex: 10
      }}>
        {number}
      </div>
    </div>

    {/* Decoration Side */}
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      justifyContent: layout === 'right' ? 'flex-end' : 'flex-start',
      padding: '0 2rem'
    }}>
      <RoadmapDecoration type={decorationType} />
    </div>
  </motion.div>
);

function LandingPage({ onUpload, analyzing, onEnterApp, selectedRole, setSelectedRole }) {
  const [isDragging, setIsDragging] = useState(false);

  const roleThemes = {
    'Frontend': { color: '#3b82f6', label: 'Frontend UI/UX', icon: Zap },
    'Backend': { color: '#6366f1', label: 'Backend Architecture', icon: BrainCircuit },
    'Fullstack': { color: '#8b5cf6', label: 'Full Stack Engineering', icon: Target },
    'BDA': { color: '#10b981', label: 'Data Analytics', icon: Globe },
    'Sales': { color: '#f43f5e', label: 'Sales & BD', icon: FileText }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(Array.from(e.dataTransfer.files), selectedRole, e.dataTransfer.files.length > 1);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files), selectedRole, e.target.files.length > 1);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative', 
      overflowX: 'hidden', 
      background: 'var(--grad-blue)',
      color: '#ffffff'
    }}>

      {/* Hero Glows - Upgraded to Aurora */}
      <div className="aurora-container">
        <div className="aurora-glow-1" />
        <div className="aurora-glow-2" />
      </div>

      {/* Navbar - Restored relative positioning for clean spacing */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 3rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        <div style={{ visibility: 'visible' }}>
          <ForgeLogo size={52} variant="sidebar" />
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button
            onClick={onEnterApp}
            className="gradient-btn"
            style={{ padding: '0.8rem 2.2rem', fontSize: '1rem', background: 'var(--grad-main)', color: '#0A1F44', border: 'none', borderRadius: '12px', fontWeight: 800 }}
          >
            Get Started <ChevronRight size={18} />
          </button>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 10, flex: 1, padding: '2rem 3rem 4rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.1fr', gap: '4rem', alignItems: 'center', minHeight: '70vh' }}>
          
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2.5rem', letterSpacing: '-0.04em' }}
            >
              AI Recruitment: <br/> 
              <span style={{ color: 'var(--secondary)', filter: 'drop-shadow(0 0 20px rgba(244, 196, 0, 0.2))' }}>Transforming</span> <br/>
              Resume Analysis
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', marginBottom: '3.5rem', fontWeight: 500, lineHeight: 1.4 }}
            >
              Unlock recruiter-grade insights and optimize your resume with our high-precision AI engine. Stand out in every ATS scan.
            </motion.p>
            {/* ... rest of content */}
            {/* ... rest of content */}

            {/* Role Selection (Glassmorphism) */}
            <div style={{ marginBottom: '3rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '1.25rem', letterSpacing: '0.15em' }}>
                SELECT YOUR SPECIALIZATION:
              </p>
              <div 
                className="hide-scrollbar"
                style={{ 
                  display: 'flex', 
                  gap: '0.75rem', 
                  overflowX: 'auto', 
                  paddingTop: '1.5rem',
                  paddingBottom: '1.5rem',
                  paddingLeft: '1.5rem',
                  paddingRight: '1.5rem',
                  margin: '0 -1.5rem',
                  marginTop: '-1.5rem'
                }}
              >
                {Object.entries(roleThemes).map(([role, theme]) => (
                  <RoleCard 
                    key={role}
                    role={role} 
                    icon={theme.icon} 
                    active={selectedRole === role} 
                    onClick={setSelectedRole} 
                  />
                ))}
              </div>
            </div>

            {/* Upload Area inside Left Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              style={{ maxWidth: '550px' }}
            >
              <div 
                className={`glass-panel premium-upload-area ${isDragging ? 'dragging' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
                style={{ 
                   padding: '2.5rem 2rem', 
                   cursor: 'pointer'
                }}
              >
                <input id="fileInput" type="file" hidden multiple accept=".pdf,.docx" onChange={handleFileChange} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <motion.div 
                    style={{ 
                      width: 70, height: 70, 
                      background: 'var(--grad-main)', 
                      borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1F44', 
                      boxShadow: `0 10px 30px rgba(244, 196, 0, 0.3)`, flexShrink: 0 
                    }}
                  >
                    <Upload size={32} />
                  </motion.div>
                  <div style={{ textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#ffffff' }}>
                      {analyzing ? 'Processing...' : `Upload Your Resume`}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.95rem' }}>
                      Drag & drop your PDF or DOCX file here
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Animated Hero Illustration - Assistant */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1.2' }}
          >
            <motion.div
              style={{ position: 'relative', width: '100%', maxWidth: '820px' }}
            >
              {/* Outer Glow Effect */}
              <div style={{ 
                position: 'absolute', inset: '10%', 
                background: 'rgba(13, 110, 253, 0.2)', 
                filter: 'blur(80px)', 
                borderRadius: '50%', 
                zIndex: -1 
              }} />

              {/* Holographic Rings */}
              <div className="hologram-ring hologram-ring-outer" style={{ borderStyle: 'solid', opacity: 0.15 }} />
              <div className="hologram-ring hologram-ring-inner" style={{ borderStyle: 'dashed', opacity: 0.2 }} />
              
              <img 
                src="/assets/landing/hero_assistant_elite_clean_1774687453608.png" 
                alt="AI Resume Assistant" 
                style={{ width: '100%', borderRadius: '40px', filter: 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.4))', position: 'relative', zIndex: 1 }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Roadmap Section - Below Hero Grid */}
        <div style={{ marginTop: '10rem', marginBottom: '8rem', position: 'relative' }}>
          <BackgroundParticles />
          <div style={{ textAlign: 'center', marginBottom: '6rem', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              AI Job Analysis System
            </h2>
            <div style={{ 
              display: 'inline-block', background: 'var(--secondary)', color: 'var(--accent)', 
              padding: '0.5rem 2.5rem', borderRadius: '14px', fontWeight: 900, 
              fontSize: '1.5rem', letterSpacing: '0.1em' 
            }}>
              ROADMAP
            </div>
          </div>

          <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', width: '95%' }}>
            {/* Step 1 */}
            <RoadmapStep number="1" title="Select Specialization" layout="left" decorationType="skills">
               <p style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Choose your professional path:</p>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', width: '100%' }}>
                  {[
                    { label: 'Frontend', img: 'frontend_3d_icon_1774684912545.png' },
                    { label: 'Backend', img: 'backend_3d_icon_1774684938216.png' },
                    { label: 'Fullstack I', img: 'fullstack_3d_icon_1774684965425.png' },
                    { label: 'Fullstack II', img: 'fullstack_orange_3d_icon_1774685014473.png' },
                    { label: 'Sales', img: 'sales_3d_icon_1774684992799.png' }
                  ].map((role) => (
                    <div key={role.label} style={{ textAlign: 'center' }}>
                      <img 
                        src={`/assets/roadmap/${role.img}`} 
                        alt={role.label} 
                        style={{ width: '100%', maxWidth: '60px', height: '60px', objectFit: 'contain', marginBottom: '0.75rem', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.2))' }} 
                      />
                      <p style={{ fontSize: '0.75rem', fontWeight: 900, color: '#fff' }}>{role.label}</p>
                    </div>
                  ))}
               </div>
            </RoadmapStep>

            {/* Step 2 */}
            <RoadmapStep number="2" title="Select Specific Role" layout="right" decorationType="radar">
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                  {['React Developer', 'UI Developer', 'UX Developer', 'Frontend Engineer'].map(p => (
                    <div key={p} style={{ padding: '0.6rem 1.25rem', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 700 }}>{p}</div>
                  ))}
               </div>
            </RoadmapStep>

            {/* Step 3 */}
            <RoadmapStep number="3" title="Paste JD + Upload Resume" layout="left" decorationType="stream">
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}><Search size={32} /></div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>+</span>
                  <div style={{ 
                    padding: '1rem 2rem', background: 'var(--secondary)', color: 'var(--accent)', 
                    borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' 
                  }}>
                    <Upload size={18} /> Upload Resume
                  </div>
               </div>
            </RoadmapStep>

            {/* Step 4 */}
            <RoadmapStep number="4" title="AI Analyzes Resume" layout="right" decorationType="neural">
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
                  <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800 }}>API Backend</div>
                  <div style={{ width: 40, height: 2, borderBottom: '2px dashed rgba(255,255,255,0.3)' }} />
                  <div style={{ padding: '1rem 1.5rem', background: 'var(--grad-main)', borderRadius: '12px', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 900 }}>AI Engine</div>
               </div>
            </RoadmapStep>

            {/* Step 5 */}
            <RoadmapStep number="5" title="Show Result & Match" layout="left" decorationType="success">
               <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    display: 'inline-flex', padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', 
                    color: '#10b981', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 900, 
                    border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1.5rem' 
                  }}>
                    <CheckCircle size={16} style={{ marginRight: '0.5rem' }} /> 85% SELECTED
                  </div>
                  <button className="gradient-btn" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                    IMPROVE RESUME <ArrowRight size={18} />
                  </button>
               </div>
            </RoadmapStep>
          </div>
        </div>

        {/* Features Section (Bottom) */}
        <section style={{ marginTop: '10rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2.5rem' }}>
          <FeatureCard icon={BarChart3} title="Deep Analysis" desc="Granular scoring based on 50+ professional metrics." delay={0.4} />
          <FeatureCard icon={Target} title="ATS Optimized" desc="Ensure your resume passes high-grade screening bots." delay={0.5} />
          <FeatureCard icon={Zap} title="Instant Feedback" desc="Identify missing skills and critical improvements in seconds." delay={0.6} />
          <FeatureCard icon={Lightbulb} title="AI Recommender" desc="Smart suggestions to elevate your candidate profile." delay={0.7} />
        </section>
      </main>

      {/* Professional Footer */}
      <footer style={{ 
        padding: '8rem 4rem 4rem', 
        position: 'relative',
        marginTop: '10rem',
        background: 'rgba(10, 31, 68, 0.6)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        overflow: 'hidden'
      }}>
        {/* Animated Shimmer Border */}
        <div className="footer-top-glow" />
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '4rem', marginBottom: '6rem' }}>
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
            <div className="footer-brand-glow" />
            <ForgeLogo size={40} variant="sidebar" />
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '320px', fontWeight: 500 }}>
              Institutional-grade resume intelligence designed to navigate high-grade ATS screening bots and elevate your candidate profile.
            </p>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <motion.div whileHover={{ y: -5, scale: 1.1 }} className="footer-social-btn"><Linkedin size={18} /></motion.div>
              <motion.div whileHover={{ y: -5, scale: 1.1 }} className="footer-social-btn"><Twitter size={18} /></motion.div>
              <motion.div whileHover={{ y: -5, scale: 1.1 }} className="footer-social-btn"><Github size={18} /></motion.div>
            </div>
          </div>

          {/* Features Column */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Core Features</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['AI Resume Analyzer', 'Job Match Engine', 'Performance Reports', 'Expert Profile Score'].map(link => (
                <motion.p key={link} whileHover={{ x: 5 }} className="footer-link-premium">{link}</motion.p>
              ))}
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['About ATS AI', 'Our Technology', 'Privacy Shield', 'Terms of Service'].map(link => (
                <motion.p key={link} whileHover={{ x: 5 }} className="footer-link-premium">{link}</motion.p>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Get In Touch</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <motion.div whileHover={{ x: 5 }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, cursor: 'pointer' }}>
                <Mail size={18} className="gradient-text" /> support@ats-ai.com
              </motion.div>
              <motion.div whileHover={{ x: 5 }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, cursor: 'pointer' }}>
                <Globe size={18} className="gradient-text" /> Global Support 24/7
              </motion.div>
              <motion.div whileHover={{ x: 5 }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, cursor: 'pointer' }}>
                <Award size={18} className="gradient-text" /> Certified AI Quality
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{ 
          maxWidth: '1400px', margin: '0 auto', 
          borderTop: '1px solid rgba(255,255,255,0.05)', 
          paddingTop: '3rem', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontWeight: 600 }}>
            &copy; 2024 ATS AI PRECISION. PREMIUM CAREER INTELLIGENCE.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', fontWeight: 700 }}>VERIFIED BY AI SECURITY</span>
            <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', fontWeight: 700 }}>H-GRADE RECRUITMENT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
