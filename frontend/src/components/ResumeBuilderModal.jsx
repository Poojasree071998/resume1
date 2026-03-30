import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Briefcase, GraduationCap, Award, ChevronRight, ChevronLeft, Save, Sparkles, Plus, Trash2 } from 'lucide-react';

const ResumeBuilderModal = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personal: { name: '', email: '', phone: '', location: '', summary: '' },
    experience: [{ id: 1, role: '', company: '', duration: '', desc: '' }],
    education: [{ id: 1, degree: '', school: '', year: '' }],
    skills: ['React', 'JavaScript', 'Node.js']
  });

  const [isSaving, setIsSaving] = useState(false);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
  };

  const addExperience = () => {
    setFormData(prev => ({ 
      ...prev, 
      experience: [...prev.experience, { id: Date.now(), role: '', company: '', duration: '', desc: '' }] 
    }));
  };

  const removeExperience = (id) => {
    setFormData(prev => ({ 
      ...prev, 
      experience: prev.experience.filter(e => e.id !== id) 
    }));
  };

  const updateExperience = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const handleSave = async () => {
     setIsSaving(true);
     // Simulate API save
     setTimeout(() => {
        setIsSaving(false);
        onComplete();
        onClose();
        setStep(1);
     }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{
          width: '740px',
          height: '680px',
          background: '#fff',
          borderRadius: '32px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.15)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '8px', background: '#F4C400', borderRadius: '10px', color: '#000' }}>
                <Sparkles size={24} />
              </div>
              Build Your Resume
            </h2>
            <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Step {step} of 4: {['Personal Details', 'Professional Experience', 'Education Info', 'Technical Skills'][step-1]}</p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', color: '#475569', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', background: '#fafbfc' }}>
           <AnimatePresence mode="wait">
             {step === 1 && (
               <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="input-group">
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Full Name</label>
                      <input name="name" value={formData.personal.name} onChange={handlePersonalChange} style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', fontWeight: 600 }} placeholder="John Doe" />
                    </div>
                    <div className="input-group">
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Email Address</label>
                      <input name="email" value={formData.personal.email} onChange={handlePersonalChange} style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', fontWeight: 600 }} placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Professional Summary</label>
                    <textarea name="summary" value={formData.personal.summary} onChange={handlePersonalChange} rows={4} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', fontWeight: 600, resize: 'none' }} placeholder="Tell us about your career journey..." />
                  </div>
               </motion.div>
             )}

             {step === 2 && (
               <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {formData.experience.map((exp, idx) => (
                    <div key={exp.id} style={{ padding: '1.5rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', position: 'relative' }}>
                       <button onClick={() => removeExperience(exp.id)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                          <input placeholder="Job Role" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: 600 }} />
                          <input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: 600 }} />
                       </div>
                       <textarea placeholder="Description of work..." value={exp.desc} onChange={(e) => updateExperience(exp.id, 'desc', e.target.value)} rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: 600, resize: 'none' }} />
                    </div>
                  ))}
                  <button onClick={addExperience} style={{ width: '100%', padding: '1rem', border: '2px dashed #cbd5e1', background: 'none', borderRadius: '16px', color: '#64748b', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Plus size={20} /> ADD EXPERIENCE
                  </button>
               </motion.div>
             )}

             {step >= 3 && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F4C40020', color: '#F4C400', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Award size={40} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Coming Soon: Skill Tagging</h3>
                  <p style={{ color: '#64748b', fontWeight: 600, marginTop: '0.5rem' }}>Step 3 and 4 are under development for AI skill extraction. Click below to save your progress!</p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Footer */}
        <div style={{ padding: '2rem 2.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} style={{ border: 'none', background: 'none', color: '#64748b', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ChevronLeft size={20} /> PREVIOUS
            </button>
          ) : <div />}
          
          {step < 3 ? (
            <button 
              onClick={() => setStep(s => s + 1)} 
              style={{ padding: '0.8rem 2rem', background: '#001f3f', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              NEXT STEP <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              style={{ padding: '0.8rem 2.5rem', background: '#F4C400', color: '#000', border: 'none', borderRadius: '14px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 5px 15px rgba(244,196,0,0.3)' }}
            >
              {isSaving ? 'PERSISTING...' : <><Save size={20} /> FINISH & ANALYZE</>}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeBuilderModal;
