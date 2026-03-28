import React from 'react';

const ForgeLogo = ({ size = 40, showText = true, variant = 'light' }) => {
  const isSidebar = variant === 'sidebar';
  const frameColor = isSidebar ? 'white' : '#0056b8';
  const atsTextColor = isSidebar ? 'white' : '#001f3f';
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '16px',
      userSelect: 'none'
    }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Frame - Dynamic Color based on background */}
        <path 
          d="M10 10H85L65 30H30V90L10 110V10Z" 
          fill={frameColor} 
        />
        
        {/* Central Yellow Box (Centered) */}
        <rect x="42" y="44" width="22" height="13" fill="#ffcc00" />
        
        {/* Elephant Silhouette Inside (Trunk Up) */}
        <path 
          d="M52 46C51 46 50.5 46.5 50.5 47C50.5 47.5 51 48 52 48H53.5V50C53.5 50.5 53 51 52.5 51H52V51.5H54.5V47.5C54.5 46.5 53.5 46 52 46Z" 
          fill="#0056b8" 
        />
        
        {/* Bottom Yellow Triangle (Proportional) */}
        <path 
          d="M20 100L54 68L88 100H20Z" 
          fill="#ffcc00" 
        />
      </svg>

      {showText && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          lineHeight: 1
        }}>
          <div style={{
            fontWeight: 900,
            fontSize: `${1.7 * (size/40)}rem`,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '-0.02em',
            color: atsTextColor,
            textTransform: 'uppercase'
          }}>
            ATS <span style={{ color: '#ffcc00' }}>AI</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgeLogo;
