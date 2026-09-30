import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.js';
import { useLanguage } from '../../../context/LanguageContext.js';
import { SharedFieldProvider, useSharedField } from '../context/SharedFieldContext.js';

interface ShellInnerProps {
  children: React.ReactNode;
  activeRoute?: string;
  pageTitle?: string;
}

const BuildAiShellContent: React.FC<ShellInnerProps> = ({ children, activeRoute, pageTitle }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { fields, selectedFieldId, selectedField, setSelectedFieldId } = useSharedField();
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const tools = [
    {
      id: 'satellite',
      title: t('buildAi.cropHealth'),
      subtitle: t('buildAi.cropHealthSub'),
      path: '/build-ai/satellite',
      icon: 'satellite_alt',
      image: '/images/tools/satellite.jpg',
      badge: 'NDVI & Maps'
    },
    {
      id: 'soil',
      title: t('buildAi.soilHealth'),
      subtitle: t('buildAi.soilHealthSub'),
      path: '/build-ai/soil-health',
      icon: 'potted_plant',
      image: '/images/tools/soil.jpg',
      badge: 'NPK & Carbon'
    },
    {
      id: 'regenerative',
      title: t('buildAi.regenAi'),
      subtitle: t('buildAi.regenAiSub'),
      path: '/build-ai/regenerative-ai',
      icon: 'psychology',
      image: '/images/tools/regenerative.jpg',
      badge: 'Action Plan'
    },
    {
      id: 'brics',
      title: t('buildAi.bricsKnowledge'),
      subtitle: t('buildAi.bricsKnowledgeSub'),
      path: '/build-ai/brics-hub',
      icon: 'public',
      image: '/images/tools/brics.jpg',
      badge: 'Best Practices'
    }
  ];

  const isInternalPage = activeRoute && activeRoute !== '/build-ai';

  const defaultTitle = isInternalPage ? (
    activeRoute === '/build-ai/satellite' ? t('buildAi.cropHealth') :
    activeRoute === '/build-ai/soil-health' || activeRoute === '/build-ai/soil' ? t('buildAi.soilHealth') :
    activeRoute === '/build-ai/regenerative-ai' ? t('buildAi.regenAi') :
    activeRoute === '/build-ai/brics-hub' || activeRoute === '/build-ai/brics' ? t('buildAi.bricsKnowledge') :
    t('buildAi.appSubtitle')
  ) : t('buildAi.appSubtitle');

  const currentTitle = pageTitle || defaultTitle;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      color: '#0F172A',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Mobile-First Header: ← Back | Title | Language | Tools */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1.5px solid #E2E8F0',
        padding: '0.5rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        gap: '0.4rem',
        minHeight: '50px',
        boxSizing: 'border-box'
      }}>
        {/* Left: Back Button & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, flex: '1 1 auto' }}>
          {isInternalPage ? (
            <button
              onClick={() => navigate('/build-ai')}
              aria-label="Back"
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '8px',
                padding: '0.35rem 0.55rem',
                color: '#15803D',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                flexShrink: 0,
                height: '34px'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
              <span style={{ display: 'inline-block' }}>{t('buildAi.backToRegen')}</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/home')}
              aria-label="Home"
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0.35rem 0.55rem',
                color: '#334155',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                flexShrink: 0,
                height: '34px'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
              <span style={{ display: 'inline-block' }}>{t('buildAi.backToHome')}</span>
            </button>
          )}

          <span style={{
            fontSize: '0.92rem',
            fontWeight: 800,
            color: '#0F172A',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {currentTitle}
          </span>
        </div>

        {/* Right: Compact Language Pill + Tools Bottom Sheet Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
          {/* Simple 3-Language Toggle Pill */}
          <div style={{
            display: 'inline-flex',
            background: '#F1F5F9',
            borderRadius: '16px',
            padding: '2px',
            border: '1px solid #E2E8F0'
          }}>
            {[
              { code: 'en', label: 'EN' },
              { code: 'hi', label: 'हि' },
              { code: 'bn', label: 'বাং' }
            ].map(langItem => (
              <button
                key={langItem.code}
                onClick={() => setLanguage(langItem.code)}
                style={{
                  background: language === langItem.code ? '#16A34A' : 'transparent',
                  color: language === langItem.code ? '#FFFFFF' : '#475569',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '2px 7px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {langItem.label}
              </button>
            ))}
          </div>

          {/* Tools Trigger */}
          <button
            onClick={() => setIsToolsOpen(true)}
            style={{
              background: '#16A34A',
              color: '#FFFFFF',
              border: '1px solid #15803D',
              borderRadius: '16px',
              padding: '0.3rem 0.65rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              height: '32px',
              boxShadow: '0 1px 2px rgba(22, 163, 74, 0.2)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>widgets</span>
            <span>Tools</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{
        flex: 1,
        padding: '0.85rem 0.75rem 2rem 0.75rem',
        maxWidth: '1080px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        {children}
      </main>

      {/* Compact Bottom Sheet for Tools Navigation */}
      {isToolsOpen && (
        <div
          onClick={() => setIsToolsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
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
              maxWidth: '480px',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '1rem 1rem 1.75rem 1rem',
              boxShadow: '0 -8px 30px rgba(0,0,0,0.18)',
              boxSizing: 'border-box'
            }}
          >
            {/* Grab handle */}
            <div style={{
              width: '36px',
              height: '4px',
              background: '#CBD5E1',
              borderRadius: '2px',
              margin: '0 auto 0.75rem auto'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 900, color: '#0F172A' }}>
                  {t('buildAi.toolsMenu')}
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748B' }}>
                  {t('buildAi.toolsMenuSubtitle')}
                </p>
              </div>
              <button
                onClick={() => setIsToolsOpen(false)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569',
                  fontWeight: 800
                }}
              >
                ✕
              </button>
            </div>

            {/* 2-Column Visual Tool Selector Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.65rem'
            }}>
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
                      border: isCurrent ? '2px solid #16A34A' : '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '0.65rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '60px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#E2E8F0'
                    }}>
                      <img
                        src={tool.image}
                        alt={tool.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                          {tool.title}
                        </span>
                        {isCurrent && (
                          <span style={{ fontSize: '0.65rem', color: '#16A34A', fontWeight: 800 }}>✓</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px', lineHeight: 1.2 }}>
                        {tool.subtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Product Overview Shortcut */}
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
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: '0.3rem'
                }}
              >
                ← {t('buildAi.backToRegen')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const BuildAiShell: React.FC<ShellInnerProps> = (props) => {
  return (
    <SharedFieldProvider>
      <BuildAiShellContent {...props} />
    </SharedFieldProvider>
  );
};
