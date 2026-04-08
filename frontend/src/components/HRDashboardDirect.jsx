import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  User, 
  Mail, 
  Calendar, 
  FileText, 
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock
} from "lucide-react";

function HRDashboardDirect() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchResumes = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/resumes")
      .then((res) => res.json())
      .then((data) => {
        setResumes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching resumes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const filteredResumes = resumes.filter(r => 
    r.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Resume <span className="gradient-text">Repository</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
            Direct database access to all uploaded resumes by employees.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={fetchResumes}
            className="glass-btn" 
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: 800, borderRadius: '12px' }}
          >
            REFRESH DATA
          </button>
        </div>
      </div>

      {/* Stats & Search Ribbon */}
      <div style={{ 
        display: 'flex', 
        gap: '1.5rem', 
        alignItems: 'center', 
        background: 'var(--glass)', 
        padding: '1.25rem', 
        borderRadius: '24px', 
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name, email or filename..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.8rem 1rem 0.8rem 3rem', 
              borderRadius: '16px', 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid var(--glass-border)',
              color: 'var(--text-main)',
              fontSize: '1rem',
              fontWeight: 600,
              outline: 'none',
              transition: 'all 0.3s'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0 1rem', borderLeft: '1px solid var(--glass-border)' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Resumes</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--primary)' }}>{resumes.length}</p>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '28px', border: '1px solid var(--glass-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1.5rem 2rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employee Details</th>
              <th style={{ padding: '1.5rem 2rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>File Information</th>
              <th style={{ padding: '1.5rem 2rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upload Date</th>
              <th style={{ padding: '1.5rem 2rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ padding: '5rem', textAlign: 'center' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto', width: '40px', height: '40px', border: '4px solid var(--glass-border)', borderTop: '4px solid var(--primary)', borderRadius: '50%' }} />
                    <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Fetching data from database...</p>
                  </td>
                </tr>
              ) : filteredResumes.length > 0 ? (
                filteredResumes.map((resume, i) => (
                  <motion.tr
                    key={resume._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ borderBottom: '1px solid var(--glass-border)', background: 'transparent' }}
                  >
                    <td style={{ padding: '1.25rem 2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ 
                          width: 48, height: 48, borderRadius: '16px', 
                          background: 'var(--grad-light)', display: 'flex', 
                          alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }}>
                          <User size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p style={{ fontWeight: 850, fontSize: '1.05rem', color: 'var(--text-main)' }}>{resume.employeeName}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                            <Mail size={12} color="var(--text-muted)" />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{resume.email}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                          <FileText size={18} />
                        </div>
                        <div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>{resume.fileName}</p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PDF DOCUMENT</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                        <Calendar size={16} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                          {new Date(resume.uploadDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                          {new Date(resume.uploadDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <a 
                          href={`http://localhost:5000/${resume.filePath}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="glass-btn"
                          style={{ 
                            padding: '0.6rem 1.2rem', 
                            fontSize: '0.8rem', 
                            fontWeight: 800, 
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'none'
                          }}
                        >
                          <ExternalLink size={14} /> VIEW
                        </a>
                        <a 
                          href={`http://localhost:5000/${resume.filePath}`} 
                          download
                          className="btn-primary"
                          style={{ 
                            padding: '0.6rem 1.2rem', 
                            fontSize: '0.8rem', 
                            fontWeight: 900, 
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'none',
                            background: 'var(--grad-main)',
                            color: 'white',
                            boxShadow: '0 8px 20px var(--primary-glow)'
                          }}
                        >
                          <Download size={14} /> DOWNLOAD
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', opacity: 0.5 }}>
                      <FileText size={64} strokeWidth={1} />
                      <div>
                        <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>No resumes found</p>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Resumes uploaded by employees will appear here automatically.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HRDashboardDirect;
