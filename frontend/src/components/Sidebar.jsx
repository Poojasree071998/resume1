import React from 'react';
import { 
  LayoutDashboard, 
  FileSearch, 
  Target, 
  MessageSquare, 
  User, 
  Zap, 
  Settings,
  ShieldCheck,
  BarChart3,
  Mail,
  LogOut,
  Vault
} from 'lucide-react';

import ForgeLogo from './ForgeLogo';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`nav-item ${active ? 'active' : ''}`}
    style={{ 
      color: active ? '#001f3f' : 'white',
      background: active ? 'var(--secondary)' : 'transparent'
    }}
  >
    <Icon size={20} color={active ? '#001f3f' : 'white'} />
    <span style={{ fontWeight: 800 }}>{label}</span>
  </div>
);

const Sidebar = ({ activeView, setActiveView, recruiterMode, setRecruiterMode, user, onLogout }) => {
  return (
    <aside className="sidebar-nav" style={{ width: '280px' }}>
      <div style={{ paddingBottom: '1.25rem', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <ForgeLogo size={34} variant="sidebar" />
      </div>

      <div className="sidebar-nav-body">
        <nav>
          <NavItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
          />
          <NavItem 
            icon={FileSearch} 
            label="AI Analyzer" 
            active={activeView === 'analyzer'} 
            onClick={() => setActiveView('analyzer')} 
          />
          <NavItem 
            icon={Target} 
            label="Job Matcher" 
            active={activeView === 'matcher'} 
            onClick={() => setActiveView('matcher')} 
          />
          <NavItem 
            icon={BarChart3} 
            label="Reports" 
            active={activeView === 'reports'} 
            onClick={() => setActiveView('reports')} 
          />
          <NavItem 
            icon={Mail} 
            label="Mail" 
            active={activeView === 'mail'} 
            onClick={() => setActiveView('mail')} 
          />
          <NavItem 
            icon={User} 
            label="My Profile" 
            active={activeView === 'profile'} 
            onClick={() => setActiveView('profile')} 
          />
        </nav>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
        <div 
          onClick={() => setRecruiterMode(!recruiterMode)}
          style={{ 
            padding: '1rem', 
            borderRadius: '16px',
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: recruiterMode ? 'rgba(255,196,0,0.1)' : 'rgba(0,0,0,0.2)',
            border: `1px solid ${recruiterMode ? 'var(--secondary)' : 'rgba(255,255,255,0.1)'}`,
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={18} color={recruiterMode ? 'var(--secondary)' : 'rgba(255,255,255,0.4)'} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: recruiterMode ? 'var(--secondary)' : 'rgba(255,255,255,0.8)' }}>Recruit Mode</span>
          </div>
          <div style={{ 
            width: 32, 
            height: 16, 
            background: recruiterMode ? 'var(--secondary)' : 'rgba(255,255,255,0.2)', 
            borderRadius: 10, 
            position: 'relative' 
          }}>
            <div style={{ 
              width: 12, 
              height: 12, 
              background: 'white', 
              borderRadius: '50%', 
              position: 'absolute', 
              top: 2, 
              left: recruiterMode ? 18 : 2,
              transition: 'all 0.3s ease'
            }} />
          </div>
        </div>

        <button 
          onClick={onLogout}
          style={{ 
            padding: '1rem', 
            borderRadius: '16px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            color: '#ef4444', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem', 
            fontWeight: 800, 
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        >
          <LogOut size={18} />
          SIGN OUT
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
