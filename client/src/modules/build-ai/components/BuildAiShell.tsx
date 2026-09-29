import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.js';
import { useLanguage } from '../../../context/LanguageContext.js';

interface Props {
  children: React.ReactNode;
  activeRoute?: string;
}

export const BuildAiShell: React.FC<Props> = ({ children, activeRoute }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();

  const navItems = [
    { id: 'overview', label: 'Overview', path: '/build-ai', icon: 'dashboard' },
    { id: 'satellite', label: 'Satellite NDVI', path: '/build-ai/satellite', icon: 'satellite_alt' },
    { id: 'soil', label: 'Soil Health', path: '/build-ai/soil-health', icon: 'potted_plant' },
    { id: 'regenerative', label: 'Regenerative AI', path: '/build-ai/regenerative-ai', icon: 'eco' },
    { id: 'brics', label: 'BRICS Hub', path: '/build-ai/brics-hub', icon: 'public' },
    { id: 'api', label: 'API Layer', path: '/build-ai/api', icon: 'api' },
    { id: 'impact', label: 'Impact Dashboard', path: '/build-ai/impact', icon: 'analytics' },
    { id: 'models', label: 'Model Cards', path: '/build-ai/model-cards', icon: 'description' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      color: '#0F172A',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Shared Header matching BharatFarm Home */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        {/* Left Brand */}
        <div 
          onClick={() => navigate('/home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <img src="/logo.png" alt="BharatFarm" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Bharat<span style={{ color: '#16A34A' }}>Farm</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 700 }}>
              Regenerative Intelligence
            </div>
          </div>
        </div>

        {/* Header Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: '#F8FAFC',
              color: '#0F172A',
              border: '1.5px solid #E2E8F0',
              borderRadius: '20px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="en">EN</option>
            <option value="hi">हिंदी</option>
            <option value="bn">বাংলা</option>
          </select>

          <button
            onClick={() => navigate('/home')}
            style={{
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              borderRadius: '20px',
              padding: '0.4rem 0.9rem',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Sub-nav Bar for Integrated Tools */}
      <nav style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0 1.5rem',
        overflowX: 'auto',
        display: 'flex',
        gap: '0.5rem'
      }}>
        {navItems.map((item) => {
          const isActive = activeRoute === item.path || (item.id === 'overview' && activeRoute === '/build-ai');
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid #16A34A' : '3px solid transparent',
                color: isActive ? '#15803D' : '#64748B',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.85rem',
                padding: '0.85rem 1rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: isActive ? '#16A34A' : '#94A3B8' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Container */}
      <main style={{
        flex: 1,
        padding: '2rem 1.5rem',
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        {children}
      </main>
    </div>
  );
};
