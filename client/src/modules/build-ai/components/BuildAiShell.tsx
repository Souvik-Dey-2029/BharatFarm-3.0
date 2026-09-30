import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.js';
import { useLanguage } from '../../../context/LanguageContext.js';

interface Props {
  children: React.ReactNode;
  activeRoute?: string;
  pageTitle?: string;
}

export const BuildAiShell: React.FC<Props> = ({ children, activeRoute, pageTitle }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const tools = [
    {
      id: 'satellite',
      title: 'Satellite Health',
      subtitle: 'Monitor crop vegetation',
      path: '/build-ai/satellite',
      icon: 'satellite_alt',
      badge: 'NDVI & Maps'
    },
    {
      id: 'soil',
      title: 'Soil Health',
      subtitle: 'Check soil condition',
      path: '/build-ai/soil-health',
      icon: 'potted_plant',
      badge: 'NPK & Carbon'
    },
    {
      id: 'regenerative',
      title: 'Regenerative AI',
      subtitle: 'Get farming recommendations',
      path: '/build-ai/regenerative-ai',
      icon: 'eco',
      badge: 'Action Plan'
    },
    {
      id: 'brics',
      title: 'BRICS Knowledge',
      subtitle: 'Explore farming practices',
      path: '/build-ai/brics-hub',
      icon: 'public',
      badge: 'Best Practices'
    }
  ];

  const isInternalPage = activeRoute && activeRoute !== '/build-ai';

  // Compute a default clean title if not explicitly passed
  const currentTitle = pageTitle || (
    activeRoute === '/build-ai/satellite' ? 'Satellite Health' :
    activeRoute === '/build-ai/soil-health' || activeRoute === '/build-ai/soil' ? 'Soil Health' :
    activeRoute === '/build-ai/regenerative-ai' ? 'Regenerative AI' :
    activeRoute === '/build-ai/brics-hub' || activeRoute === '/build-ai/brics' ? 'BRICS Knowledge' :
    'Regenerative Intelligence'
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      color: '#0F172A',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Compact Global Track 4 Header */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        gap: '0.5rem',
        minHeight: '52px',
        boxSizing: 'border-box'
      }}>
        {/* Left: Back Action & Branding / Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
          {isInternalPage ? (
            <button
              onClick={() => navigate('/build-ai')}
              title="Back to Regenerative Intelligence"
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '8px',
                padding: '0.45rem 0.65rem',
                color: '#15803D',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                flexShrink: 0,
                minHeight: '38px'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
              <span className="back-btn-text">Back</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/home')}
              title="Back to Home"
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0.45rem 0.65rem',
                color: '#334155',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                flexShrink: 0,
                minHeight: '38px'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
              <span className="back-btn-text">Home</span>
            </button>
          )}

          {/* Page Title Context in Header */}
          <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{
              fontSize: '0.98rem',
              fontWeight: 800,
              color: '#0F172A',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {currentTitle}
            </span>
          </div>
        </div>

        {/* Right: Language + Explore Tools trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: '#F8FAFC',
              color: '#0F172A',
              border: '1.5px solid #E2E8F0',
              borderRadius: '16px',
              padding: '0.3rem 0.6rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
              height: '36px'
            }}
          >
            <option value="en">EN</option>
            <option value="hi">हिंदी</option>
            <option value="bn">বাংলা</option>
          </select>

          {/* Contextual Explore Tools Button */}
          <button
            onClick={() => setIsToolsOpen(true)}
            style={{
              background: '#16A34A',
              color: '#FFFFFF',
              border: '1px solid #15803D',
              borderRadius: '18px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              height: '36px',
              boxShadow: '0 1px 3px rgba(22, 163, 74, 0.25)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>widgets</span>
            <span>Explore Tools</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{
        flex: 1,
        padding: '1.5rem 1rem',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        {children}
      </main>

      {/* Tool Panel Modal / Bottom Sheet */}
      {isToolsOpen && (
        <div
          onClick={() => setIsToolsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(3px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              width: '100%',
              maxWidth: '520px',
              borderTopLeftRadius: '22px',
              borderTopRightRadius: '22px',
              padding: '1.25rem 1.25rem 2rem 1.25rem',
              boxShadow: '0 -8px 30px rgba(0,0,0,0.18)',
              boxSizing: 'border-box',
              animation: 'slideUp 0.2s ease-out'
            }}
          >
            {/* Panel Grab Bar & Header */}
            <div style={{
              width: '36px',
              height: '4px',
              background: '#CBD5E1',
              borderRadius: '2px',
              margin: '0 auto 0.85rem auto'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                  Track 4 Tools
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748B' }}>
                  Select an intelligence capability to view
                </p>
              </div>
              <button
                onClick={() => setIsToolsOpen(false)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                ✕
              </button>
            </div>

            {/* Tool Selection Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {tools.map((tool) => {
                const isCurrent = activeRoute === tool.path || (tool.id === 'soil' && activeRoute === '/build-ai/soil') || (tool.id === 'brics' && activeRoute === '/build-ai/brics');
                return (
                  <div
                    key={tool.id}
                    onClick={() => {
                      setIsToolsOpen(false);
                      navigate(tool.path);
                    }}
                    style={{
                      background: isCurrent ? '#F0FDF4' : '#F8FAFC',
                      border: isCurrent ? '1.5px solid #16A34A' : '1px solid #E2E8F0',
                      borderRadius: '14px',
                      padding: '0.85rem 1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: isCurrent ? '#DCFCE7' : '#FFFFFF',
                        border: '1px solid',
                        borderColor: isCurrent ? '#BBF7D0' : '#E2E8F0',
                        color: isCurrent ? '#15803D' : '#16A34A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{tool.icon}</span>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A' }}>
                            {tool.title}
                          </span>
                          {isCurrent && (
                            <span style={{
                              fontSize: '0.66rem',
                              fontWeight: 800,
                              background: '#DCFCE7',
                              color: '#15803D',
                              padding: '1px 6px',
                              borderRadius: '4px'
                            }}>
                              Current
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px' }}>
                          {tool.subtitle}
                        </div>
                      </div>
                    </div>

                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: isCurrent ? '#16A34A' : '#94A3B8' }}>
                      arrow_forward
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Back to Home Shortcut in Panel */}
            <div style={{ marginTop: '0.85rem', textAlign: 'center' }}>
              <button
                onClick={() => {
                  setIsToolsOpen(false);
                  navigate('/build-ai');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#15803D',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '0.4rem'
                }}
              >
                ← Product Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
