import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import ForgeLogo from './ForgeLogo';
import {
  Upload, Zap, Target, BarChart3, Lightbulb, FileText,
  ChevronRight, Globe, BrainCircuit, Shield, TrendingUp,
  Search, CheckCircle, ArrowRight, Sparkles, Mail, Award,
  Twitter, Linkedin, Github, Star, Users, Clock, Code2,
  Database, Layers, Cpu, LayoutDashboard, HelpCircle, MessageSquare
} from 'lucide-react';
import ContactModal from './ContactModal';

/* ─── Mouse Position Hook ────────────────────────────────────── */
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return mousePosition;
};

/* ─── Magnetic Wrapper ────────────────────────────────────────── */
const MagneticWrapper = ({ children, strength = 0.2 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const moveX = (clientX - centerX) * strength;
    const moveY = (clientY - centerY) * strength;
    setPosition({ x: moveX, y: moveY });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', damping: 15, stiffness: 150, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

/* ─── Character Reveal ────────────────────────────────────────── */
const CharacterReveal = ({ text, delay = 0 }) => {
  const words = text.split(' ');
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.3em' }}>
          <motion.span
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.1,
              ease: [0.33, 1, 0.68, 1]
            }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

/* ─── Animated Counter ───────────────────────────────────────── */
const AnimatedCounter = ({ target, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

/* ─── Floating Grid Background ───────────────────────────────── */
const GridBackground = () => (
  <div style={{
    position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0
  }}>
    {/* Animated Shimmer Grid */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
      backgroundSize: '40px 40px',
      maskImage: 'radial-gradient(circle at 50% 50%, black, transparent)',
      animation: 'shimmer 20s linear infinite'
    }} />
    
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.03 }}>
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    {/* Elegant Orbs */}
    <motion.div
      animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.3, 1] }}
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', top: '-10%', right: '5%',
        width: 800, height: 800,
        background: 'radial-gradient(circle, rgba(244,196,0,0.08) 0%, transparent 65%)',
        borderRadius: '50%', filter: 'blur(80px)'
      }}
    />
    <motion.div
      animate={{ x: [0, -80, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      style={{
        position: 'absolute', bottom: '0%', left: '-10%',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 65%)',
        borderRadius: '50%', filter: 'blur(100px)'
      }}
    />
    
    {/* Floating 3D Elements */}
    <motion.div
      animate={{ rotate: 360, y: [0, -20, 0] }}
      transition={{ rotate: { duration: 30, repeat: Infinity, ease: 'linear' }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
      style={{
        position: 'absolute', top: '20%', right: '25%',
        width: 120, height: 40, borderRadius: 100,
        border: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.01)',
        backdropFilter: 'blur(5px)', transform: 'perspective(1000px) rotateX(45deg)'
      }}
    />
  </div>
);

/* ─── Floating Stat Chip ──────────────────────────────────────── */
const StatChip = ({ icon: Icon, value, label, color, delay, style }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 200 }}
    whileHover={{ scale: 1.05, y: -4 }}
    style={{
      position: 'absolute',
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 16,
      padding: '0.85rem 1.25rem',
      display: 'flex', alignItems: 'center', gap: '0.9rem',
      boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
      cursor: 'default',
      zIndex: 10,
      minHeight: '64px',
      ...style
    }}
  >
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: `${color}22`,
      border: `1px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: color, flexShrink: 0
    }}>
      <Icon size={16} strokeWidth={2.5} />
    </div>
    <div>
      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  </motion.div>
);

/* ─── Role Selector Pill ──────────────────────────────────────── */
const RolePill = ({ role, icon: Icon, active, onClick, color }) => (
  <motion.button
    whileHover={{ scale: 1.06, y: -3 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onClick(role)}
    style={{
      padding: '0.7rem 1.4rem',
      borderRadius: 50,
      border: active ? `1.5px solid ${color}` : '1px solid rgba(255,255,255,0.12)',
      background: active ? `${color}18` : 'rgba(255,255,255,0.04)',
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      color: active ? '#fff' : 'rgba(255,255,255,0.5)',
      fontSize: '0.85rem', fontWeight: 700,
      boxShadow: active ? `0 0 20px ${color}30` : 'none',
      whiteSpace: 'nowrap'
    }}
  >
    <Icon size={15} strokeWidth={2.5} style={{ color: active ? color : 'rgba(255,255,255,0.4)' }} />
    {role}
  </motion.button>
);

/* ─── Feature Card ────────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -8 }}
    style={{
      padding: '2.25rem',
      borderRadius: 24,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = `${accent}40`;
      e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px ${accent}20`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    {/* Corner accent line */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
      background: `linear-gradient(90deg, transparent, ${accent}60, transparent)`,
      opacity: 0.6
    }} />
    <div style={{
      width: 48, height: 48, borderRadius: 14,
      background: `${accent}15`,
      border: `1px solid ${accent}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: accent, marginBottom: '1.5rem'
    }}>
      <Icon size={22} strokeWidth={2} />
    </div>
    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>{title}</h3>
    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.65, fontWeight: 500 }}>{desc}</p>
  </motion.div>
);

/* ─── Process Step ────────────────────────────────────────────── */
const ProcessStep = ({ num, title, desc, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: num * 0.12, duration: 0.5 }}
    style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
  >
    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: 'linear-gradient(135deg, #F4C400, #FFB700)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#0A1628', fontWeight: 900, fontSize: '1rem',
        boxShadow: '0 8px 24px rgba(244,196,0,0.35)'
      }}>{num}</div>
      {num < 4 && (
        <div style={{ width: 1, height: 40, background: 'rgba(244,196,0,0.2)', marginTop: '0.5rem' }} />
      )}
    </div>
    <div style={{ paddingTop: '0.6rem', paddingBottom: num < 4 ? '2rem' : 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
        <Icon size={16} strokeWidth={2} style={{ color: '#F4C400' }} />
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{title}</h4>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.6, fontWeight: 500 }}>{desc}</p>
    </div>
  </motion.div>
);

/* ─── Testimonial Card ────────────────────────────────────────── */
const TestimonialCard = ({ name, role, company, text, rating, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ y: -6 }}
    style={{
      padding: '2rem',
      borderRadius: 20,
      background: 'rgba(255,255,255,0.035)',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)'
    }}
  >
    <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1.25rem' }}>
      {[...Array(rating)].map((_, i) => (
        <Star key={i} size={14} fill="#F4C400" color="#F4C400" />
      ))}
    </div>
    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>
      "{text}"
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: 'linear-gradient(135deg, #F4C400, #0ea5e9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.9rem', fontWeight: 800, color: '#0A1628'
      }}>
        {name[0]}
      </div>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#fff' }}>{name}</div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{role} · {company}</div>
      </div>
    </div>
  </motion.div>
);

/* ─── Main Component ──────────────────────────────────────────── */
function LandingPage({ onUpload, analyzing, onEnterApp, onPrompt, selectedRole, setSelectedRole, isLoggedIn }) {
  const [showUpload, setShowUpload] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { scrollY } = useScroll();
  const mousePos = useMousePosition();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  const roles = [
    { id: 'Frontend', icon: Zap, color: '#3b82f6' },
    { id: 'Backend', icon: Database, color: '#8b5cf6' },
    { id: 'Fullstack', icon: Layers, color: '#ec4899' },
    { id: 'BDA', icon: BarChart3, color: '#10b981' },
    { id: 'Sales', icon: TrendingUp, color: '#f97316' },
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0)
      onUpload(Array.from(e.dataTransfer.files), selectedRole, e.dataTransfer.files.length > 1);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length > 0)
      onUpload(Array.from(e.target.files), selectedRole, e.target.files.length > 1);
  };

  const activeRole = roles.find(r => r.id === selectedRole) || roles[0];

  return (
    <div 
      onClick={() => {
        if (!isLoggedIn) {
          onPrompt(true);
        }
      }}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #060d1a 0%, #0a1628 40%, #080f1e 100%)',
        color: '#fff',
        overflowX: 'hidden',
        position: 'relative',
        cursor: !isLoggedIn ? 'pointer' : 'default'
      }}
    >
      <GridBackground />

      {/* Global Cursor Glow */}
      <motion.div
        animate={{ x: mousePos.x - 400, y: mousePos.y - 400 }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
        style={{
          position: 'fixed', inset: 0, width: 800, height: 800,
          background: 'radial-gradient(circle, rgba(244,196,0,0.05) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 1, filter: 'blur(60px)'
        }}
      />

      {/* ── Navbar ────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 3rem',
          background: 'rgba(6,13,26,0.7)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <ForgeLogo size={48} variant="sidebar" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <motion.button
            whileHover={{ scale: 1.05, color: '#F4C400', borderColor: 'rgba(244,196,0,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowContactModal(true);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem 1.2rem', borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.85rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.3s ease'
            }}
          >
            <Mail size={16} /> Contact
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onEnterApp();
            }}
            style={{
              padding: '0.65rem 1.6rem', borderRadius: 12,
              background: 'linear-gradient(135deg, #F4C400, #FFB700)',
              border: 'none', color: '#0A1628',
              fontSize: '0.875rem', fontWeight: 800,
              cursor: 'pointer', letterSpacing: '0.02em',
              boxShadow: '0 4px 20px rgba(244,196,0,0.35)',
              display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            Sign In <ChevronRight size={14} />
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Hero Section ──────────────────────────────── */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        transition={{ type: 'spring' }}
      >
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '7rem 3rem 5rem',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '5rem', alignItems: 'center',
          position: 'relative'
        }}>
          {/* Left */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 1rem', borderRadius: 50,
                background: 'rgba(244,196,0,0.1)',
                border: '1px solid rgba(244,196,0,0.2)',
                marginBottom: '2rem',
                fontSize: '0.78rem', fontWeight: 700,
                color: '#F4C400', letterSpacing: '0.08em', textTransform: 'uppercase'
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: '#F4C400',
                boxShadow: '0 0 8px #F4C400', animation: 'pulse 2s infinite'
              }} />
              AI-Powered Resume Intelligence
            </motion.div>

            {/* Headline */}
            <h1 style={{
                fontSize: 'clamp(2.8rem, 5vw, 4.25rem)',
                fontWeight: 900, lineHeight: 1.05,
                letterSpacing: '-0.05em',
                marginBottom: '1.5rem',
                position: 'relative'
              }}>
                <CharacterReveal text="Hire smarter." delay={0.2} />
                <br />
                <CharacterReveal text="Rank faster." delay={0.4} />
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, #F4C400 0%, #FFD700 50%, #E8A000 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', display: 'inline-block'
                }}>
                  <CharacterReveal text="Win every role." delay={0.6} />
                </span>
              </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{
                fontSize: '1.1rem', color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7, maxWidth: 480,
                marginBottom: '2.5rem', fontWeight: 500
              }}
            >
              Drop your resume. Get ATS scores, skill gap analysis, and role-specific feedback — in under 10 seconds.
            </motion.p>

            {/* Role pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.85rem' }}>
                Optimize for
              </p>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                {roles.map(r => (
                  <RolePill
                    key={r.id} role={r.id} icon={r.icon}
                    active={selectedRole === r.id}
                    onClick={(role) => { setSelectedRole(role); setShowUpload(false); }} 
                    color={r.color}
                  />
                ))}
              </div>
            </motion.div>

            {/* Guided Proceed Button */}
            <AnimatePresence>
              {!showUpload && (
                <MagneticWrapper strength={0.15}>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${activeRole.color}50` }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLoggedIn) {
                        onPrompt(true);
                        return;
                      }
                      setShowUpload(true);
                    }}
                    style={{
                      padding: '1.25rem 2.5rem',
                      borderRadius: 20,
                      background: `linear-gradient(135deg, ${activeRole.color}, ${activeRole.color}dd)`,
                      border: 'none',
                      color: '#fff',
                      fontSize: '1.05rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      boxShadow: `0 20px 40px ${activeRole.color}30`,
                      marginBottom: '2rem',
                      letterSpacing: '0.03em',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    PROCEED TO SCAN <ChevronRight size={22} strokeWidth={3} />
                  </motion.button>
                </MagneticWrapper>
              )}
            </AnimatePresence>

            {/* Upload area - Guided Reveal */}
            <AnimatePresence>
              {showUpload && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: 20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('lp-file-input').click()}
                    style={{
                      padding: '1.75rem 2rem',
                      borderRadius: 20,
                      border: isDragging
                        ? `2px solid ${activeRole.color}`
                        : '1.5px dashed rgba(255,255,255,0.15)',
                      background: isDragging
                        ? `${activeRole.color}08`
                        : 'rgba(255,255,255,0.025)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex', alignItems: 'center', gap: '1.5rem',
                      boxShadow: isDragging ? `0 0 40px ${activeRole.color}20` : 'none',
                      marginBottom: '1rem'
                    }}
                  >
                    <input id="lp-file-input" type="file" hidden multiple accept=".pdf,.docx" onChange={handleFileChange} />
                    <motion.div
                      animate={{ rotate: analyzing ? 360 : 0 }}
                      transition={{ duration: 2, repeat: analyzing ? Infinity : 0, ease: 'linear' }}
                      style={{
                        width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                        background: 'linear-gradient(135deg, #F4C400, #FFB700)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#0A1628', boxShadow: '0 8px 24px rgba(244,196,0,0.4)'
                      }}
                    >
                      {analyzing ? <Sparkles size={24} /> : <Upload size={24} />}
                    </motion.div>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', marginBottom: '0.25rem' }}>
                        {analyzing ? 'Analyzing your resume...' : 'Drop your resume here'}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                        PDF or DOCX · Max 5MB · Instant results
                      </p>
                    </div>
                    <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                      <div style={{
                        padding: '0.5rem 1.1rem', borderRadius: 10,
                        background: 'rgba(244,196,0,0.12)',
                        border: '1px solid rgba(244,196,0,0.2)',
                        fontSize: '0.78rem', fontWeight: 700, color: '#F4C400'
                      }}>Browse</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Always show recruitment link under either Proceed or Upload */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.25rem' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEnterApp(true)}
                style={{
                  width: '100%', marginTop: '1rem', padding: '0.9rem',
                  borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem',
                  fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <LayoutDashboard size={16} />
                Open recruitment dashboard
              </motion.button>
            </motion.div>
          </div>

          {/* Right — Stats + Visual Grid */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            minHeight: 500
          }}>
            {/* Central card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: 340,
                padding: '2.25rem',
                borderRadius: 32,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(30px)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
                zIndex: 5,
                position: 'relative'
              }}
            >
              {/* Mock score UI */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Resume Score</span>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.7rem', borderRadius: 20 }}>✓ Strong</span>
              </div>
              {/* Score ring */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', width: 120, height: 120 }}>
                  <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
                    <motion.circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke="url(#scoreGrad)" strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={327}
                      initial={{ strokeDashoffset: 327 }}
                      animate={{ strokeDashoffset: 327 * (1 - 0.85) }}
                      transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#F4C400"/>
                        <stop offset="100%" stopColor="#FFD700"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#F4C400', lineHeight: 1 }}>85</span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>/ 100</span>
                  </div>
                </div>
              </div>
              {/* Mini bars */}
              {[
                { label: 'ATS Compatibility', val: 92, color: '#10b981' },
                { label: 'Keyword Match', val: 78, color: '#3b82f6' },
                { label: 'Skills Coverage', val: 84, color: '#F4C400' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: '0.72rem', color, fontWeight: 800 }}>{val}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 999 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 1.2, delay: 1, ease: 'easeOut' }}
                      style={{ height: '100%', background: color, borderRadius: 999 }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* ── Stats Bar ─────────────────────────────────── */}
      <section style={{
        background: 'rgba(255,255,255,0.025)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '3rem'
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem', textAlign: 'center'
        }}>
          {[
            { value: 12400, suffix: '+', label: 'Resumes Analyzed', color: '#F4C400' },
            { value: 94, suffix: '%', label: 'Interview Selection Rate', color: '#10b981' },
            { value: 50, suffix: '+', label: 'Scoring Metrics', color: '#3b82f6' },
            { value: 4900, suffix: '', prefix: '4.', label: 'Average User Rating', color: '#ec4899' },
          ].map(({ value, suffix, prefix, label, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color, letterSpacing: '-0.04em' }}>
                <AnimatedCounter target={value} suffix={suffix} prefix={prefix} />
              </div>
              <div style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '7rem 3rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F4C400', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}>
            What we offer
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Everything you need to land <br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>the role you deserve</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          <FeatureCard icon={BarChart3} title="Deep ATS Scoring" desc="50+ professional metrics evaluated in real time. Know exactly where you stand before applying." accent="#F4C400" delay={0.1} />
          <FeatureCard icon={Target} title="Role-Specific Match" desc="Get precision-tuned feedback for Frontend, Backend, Sales & more with JD-aware AI." accent="#3b82f6" delay={0.2} />
          <FeatureCard icon={Zap} title="10-Second Analysis" desc="No wait, no sign-up needed. Upload → instant feedback. It's that fast." accent="#ec4899" delay={0.3} />
          <FeatureCard icon={Lightbulb} title="Gap Remediation" desc="Get clear, actionable suggestions — skills to add, keywords to include, formatting fixes." accent="#10b981" delay={0.4} />
          <FeatureCard icon={Shield} title="ATS Bypass Engine" desc="Trained on real ATS logic. We tell you what bots reject before they do." accent="#8b5cf6" delay={0.5} />
          <FeatureCard icon={BrainCircuit} title="AI Resume Rewriter" desc="Let our AI reconstruct your resume with better language, structure, and impact." accent="#f97316" delay={0.6} />
          <FeatureCard icon={Globe} title="Recruiter Dashboard" desc="For HR teams — bulk upload, rank candidates, schedule interviews, all in one place." accent="#0ea5e9" delay={0.7} />
          <FeatureCard icon={TrendingUp} title="Career Roadmap" desc="Get a curated, step-by-step growth path based on your current skill level and target role." accent="#F4C400" delay={0.8} />
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section style={{
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '7rem 3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F4C400', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}>Process</p>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '3rem' }}>
                From upload to <br />offer in 4 steps
              </h2>
            </motion.div>
            <ProcessStep num={1} title="Choose your specialization" desc="Select your target domain and specific role — Frontend, Backend, Fullstack, Sales, or BDA." icon={Layers} />
            <ProcessStep num={2} title="Paste a job description" desc="Add the JD from any job board for pinpoint keyword matching and context-aware scoring." icon={Search} />
            <ProcessStep num={3} title="Upload your resume" desc="Drop a PDF or DOCX. Our parser extracts every section with precision in seconds." icon={Upload} />
            <ProcessStep num={4} title="Get your results" desc="Receive your ATS score, skill gap analysis, rewrite suggestions, and a career roadmap." icon={Sparkles} />
          </div>

          {/* Right side: Feature highlight card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              padding: '2.5rem',
              borderRadius: 28,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
              Sample Analysis
            </p>
            {[
              { label: 'Experience Relevance', score: 88, color: '#10b981' },
              { label: 'Keyword Density', score: 72, color: '#3b82f6' },
              { label: 'Impact Statements', score: 65, color: '#F4C400' },
              { label: 'Formatting Score', score: 95, color: '#ec4899' },
              { label: 'Education Match', score: 80, color: '#8b5cf6' },
            ].map(({ label, score, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ marginBottom: '1.25rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: '0.85rem', color, fontWeight: 800 }}>{score}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${color}80, ${color})`, borderRadius: 999 }}
                  />
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              style={{
                marginTop: '2rem', padding: '1rem 1.5rem',
                borderRadius: 14,
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.15)',
                display: 'flex', alignItems: 'center', gap: '0.75rem'
              }}
            >
              <CheckCircle size={18} color="#10b981" />
              <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 700 }}>
                Above threshold — Ready for submission
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '7rem 3rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F4C400', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}>Testimonials</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>
            Trusted by candidates <br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>and hiring teams alike</span>
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <TestimonialCard name="Riya Sharma" role="Frontend Engineer" company="Razorpay" rating={5}
            text="The ATS feedback was incredibly accurate. I updated my resume based on the suggestions and got callbacks from 3 companies within a week." delay={0.1} />
          <TestimonialCard name="Arjun Nair" role="HR Manager" company="InfySoft" rating={5}
            text="We use the recruiter dashboard to screen 200+ applications. The AI ranking saves us hours every hiring cycle. It's become indispensable." delay={0.2} />
          <TestimonialCard name="Priya Menon" role="Backend Developer" company="Swiggy" rating={5}
            text="The skill gap analysis told me exactly what was missing for my target senior role. The career roadmap was spot-on and practical." delay={0.3} />
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────── */}
      <section style={{ padding: '0 3rem 8rem', maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            padding: '4rem',
            borderRadius: 32,
            background: 'linear-gradient(135deg, rgba(244,196,0,0.08) 0%, rgba(14,165,233,0.05) 100%)',
            border: '1px solid rgba(244,196,0,0.15)',
            textAlign: 'center',
            position: 'relative', overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(244,196,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F4C400', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>Get started free</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
            Your next offer starts <br />with one upload.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.05rem', marginBottom: '2.5rem', fontWeight: 500 }}>
            No account needed. No credit card. Just results.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <motion.button
              onClick={() => {
                if (!isLoggedIn) {
                  onPrompt(true);
                  return;
                }
                document.getElementById('lp-file-input').click();
              }}
              style={{
                padding: '1rem 2.5rem', borderRadius: 14,
                background: 'linear-gradient(135deg, #F4C400, #FFB700)',
                border: 'none', color: '#0A1628',
                fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                boxShadow: '0 8px 28px rgba(244,196,0,0.35)'
              }}
            >
              <Upload size={18} /> Analyze My Resume
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onEnterApp}
              style={{
                padding: '1rem 2.5rem', borderRadius: 14,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.6rem'
              }}
            >
              <LayoutDashboard size={18} /> Recruiter Dashboard
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.2)',
        padding: '4rem 3rem'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
          <div>
            <ForgeLogo size={40} variant="sidebar" />
            <p style={{ marginTop: '1.25rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 280, fontWeight: 500 }}>
              Institutional-grade resume intelligence for modern job seekers and hiring teams.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {[Linkedin, Twitter, Github].map((Icon, i) => (
                <motion.div key={i} whileHover={{ y: -3, scale: 1.1 }} style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(255,255,255,0.5)'
                }}>
                  <Icon size={16} />
                </motion.div>
              ))}
            </div>
          </div>
          {[
            { title: 'Features', links: ['AI Analyzer', 'Job Matcher', 'Reports', 'Career Roadmap'] },
            { title: 'Company', links: ['About', 'Technology', 'Privacy', 'Terms'] },
            { title: 'Support', links: ['support@forge.ai', '24/7 Global Support', 'Documentation', 'Status'] },
          ].map(({ title, links }) => (
            <div key={title} id={title === 'Support' ? 'footer-support' : undefined}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>{title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {links.map(link => (
                  <motion.span key={link} whileHover={{ x: 4, color: '#fff' }}
                    style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }}>
                    {link}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>© 2025 Forge AI. All rights reserved.</span>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>Built for the next generation of talent</span>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>

      <AnimatePresence>
        {showContactModal && (
          <ContactModal 
            isOpen={showContactModal} 
            onClose={() => setShowContactModal(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default LandingPage;
