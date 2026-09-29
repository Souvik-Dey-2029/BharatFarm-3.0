import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BuildAiLauncherPage: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      id: 'satellite',
      title: 'Satellite Data Integration',
      badge: 'Available Now',
      badgeColor: '#34D399',
      purpose: 'Field-level vegetation health, NDVI index, time-series telemetry & high-res satellite map views.',
      route: '/build-ai/satellite',
      icon: '🛰️',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'soil',
      title: 'Soil Health Analysis',
      badge: 'Track 4',
      badgeColor: '#60A5FA',
      purpose: 'pH, NPK, organic carbon assessment with transparent AI soil restoration recommendations.',
      route: '/build-ai/soil-health',
      icon: '🌱',
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'regenerative',
      title: 'Regenerative AI Engine',
      badge: 'Track 4',
      badgeColor: '#A78BFA',
      purpose: 'Structured sustainable farming action plans combining soil, climate, and crop context.',
      route: '/build-ai/regenerative-ai',
      icon: '🤖',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'brics',
      title: 'BRICS Data & Knowledge Hub',
      badge: 'Knowledge',
      badgeColor: '#F59E0B',
      purpose: 'Comparative crop practices, research datasets, and sustainable agricultural insights across BRICS nations.',
      route: '/build-ai/brics-hub',
      icon: '🌐',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'api',
      title: 'Interoperable API Layer',
      badge: 'API Gateway',
      badgeColor: '#38BDF8',
      purpose: 'Documented agricultural data sharing endpoints and machine-readable OpenAPI specs.',
      route: '/build-ai/api',
      icon: '🔗',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'impact',
      title: 'Impact & Evaluation Dashboard',
      badge: 'Metrics',
      badgeColor: '#F472B6',
      purpose: 'Yield, soil health, water-use efficiency, and risk-reduction outcome tracking.',
      route: '/build-ai/impact',
      icon: '📊',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'models',
      title: 'Data Sources & Model Cards',
      badge: 'Transparency',
      badgeColor: '#9CA3AF',
      purpose: 'Transparent AI provenance, provider details, inputs, outputs, and limitations.',
      route: '/build-ai/model-cards',
      icon: '📋',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface-bg, #0b1d12)',
      color: 'var(--text-primary, #ffffff)',
      padding: '1.25rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <button
            onClick={() => navigate('/home')}
            style={{
              padding: '0.45rem 0.8rem',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginBottom: '0.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            ← Back to Home
          </button>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            🚀 Build with AI — Track 4 Suite
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)' }}>
            AgriN & Regenerative Agricultural Intelligence Workspace
          </p>
        </div>

        <div style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          padding: '6px 14px',
          borderRadius: '20px',
          color: '#4ADE80',
          fontWeight: 700,
          fontSize: '0.8rem'
        }}>
          Track 4 Submission Ready
        </div>
      </div>

      {/* Grid of Launcher Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => navigate(card.route)}
            style={{
              background: 'var(--surface-card, #12281a)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            {/* Image Banner */}
            <div style={{
              height: '130px',
              width: '100%',
              position: 'relative',
              backgroundImage: `url(${card.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(18,40,26,0.95) 100%)'
              }} />
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(4px)',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: card.badgeColor,
                border: `1px solid ${card.badgeColor}40`
              }}>
                {card.badge}
              </div>
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                fontSize: '1.8rem'
              }}>
                {card.icon}
              </div>
            </div>

            {/* Card Details */}
            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  {card.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.45 }}>
                  {card.purpose}
                </p>
              </div>

              <div style={{
                marginTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#34D399',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                <span>Open Feature Workspace</span>
                <span>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
