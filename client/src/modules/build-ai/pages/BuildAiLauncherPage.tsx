import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildAiShell } from '../components/BuildAiShell.js';

export const BuildAiLauncherPage: React.FC = () => {
  const navigate = useNavigate();

  const capabilities = [
    {
      id: 'satellite',
      title: 'Satellite Data Integration',
      subtitle: 'Earth Observation Telemetry',
      purpose: 'Field-level NDVI index, canopy health tracking, and 10m Sentinel-2 satellite observation map.',
      route: '/build-ai/satellite',
      icon: 'satellite_alt',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'soil',
      title: 'Soil Health Analysis',
      subtitle: 'Lab Diagnostic Engine',
      purpose: 'pH, NPK, and organic carbon assessment with transparent soil restoration priorities.',
      route: '/build-ai/soil-health',
      icon: 'potted_plant',
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'regenerative',
      title: 'Regenerative AI Engine',
      subtitle: 'Action Plan Synthesizer',
      purpose: 'Structured sustainable farming action plans combining soil, climate, and crop telemetry.',
      route: '/build-ai/regenerative-ai',
      icon: 'eco',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'brics',
      title: 'BRICS Data & Knowledge Hub',
      subtitle: 'Multi-Nation Research Base',
      purpose: 'Comparative crop practices, research datasets, and sustainable insights across BRICS nations.',
      route: '/build-ai/brics-hub',
      icon: 'public',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'api',
      title: 'Interoperable API Layer',
      subtitle: 'Data Sharing Gateway',
      purpose: 'Documented agricultural data sharing endpoints and machine-readable OpenAPI specs.',
      route: '/build-ai/api',
      icon: 'api',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'impact',
      title: 'Impact & Evaluation Dashboard',
      subtitle: 'Outcome Metrics',
      purpose: 'Yield, soil health, water-use efficiency, and risk-reduction outcome tracking.',
      route: '/build-ai/impact',
      icon: 'analytics',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'models',
      title: 'Data Sources & Model Cards',
      subtitle: 'AI Transparency',
      purpose: 'Transparent AI provenance, provider details, inputs, outputs, and limitations.',
      route: '/build-ai/model-cards',
      icon: 'description',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <BuildAiShell activeRoute="/build-ai">
      {/* Product Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
        border: '1.5px solid #BBF7D0',
        borderRadius: '24px',
        padding: '2rem 2.5rem',
        marginBottom: '2.5rem',
        boxShadow: '0 4px 16px rgba(22, 163, 74, 0.06)'
      }}>
        <div style={{ maxWidth: '850px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#DCFCE7',
            color: '#15803D',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '0.85rem'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>eco</span>
            <span>AgriN & Regenerative Agricultural Intelligence</span>
          </div>

          <h1 style={{ margin: '0 0 0.75rem 0', fontSize: '1.85rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            BharatFarm Regenerative Intelligence
          </h1>

          <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, fontWeight: 500 }}>
            An integrated product combining field boundaries, Sentinel-2 satellite telemetry, laboratory soil health assessment, micro-climate weather forecasts, and multi-nation BRICS knowledge into actionable regenerative farming action plans.
          </p>
        </div>
      </div>

      {/* Integrated Tools Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="material-symbols-outlined" style={{ color: '#16A34A' }}>widgets</span>
          <span>Integrated Intelligence Capabilities</span>
        </h2>
        <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#15803D', background: '#DCFCE7', padding: '0.3rem 0.75rem', borderRadius: '14px' }}>
          7 Modules Available
        </span>
      </div>

      {/* Grid of Clean Product Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {capabilities.map((card) => (
          <div
            key={card.id}
            onClick={() => navigate(card.route)}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(22, 163, 74, 0.12)';
              e.currentTarget.style.borderColor = '#86EFAC';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
            {/* Image Header with Overlay & Icon */}
            <div style={{ position: 'relative', height: '130px', width: '100%', overflow: 'hidden' }}>
              <img
                src={card.image}
                alt={card.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.6) 100%)'
              }} />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(4px)',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{card.icon}</span>
              </div>
            </div>

            {/* Card Content */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.2rem' }}>
                  {card.subtitle}
                </div>
                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                  {card.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.45, fontWeight: 500 }}>
                  {card.purpose}
                </p>
              </div>

              <div style={{
                marginTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#15803D',
                fontSize: '0.85rem',
                fontWeight: 800
              }}>
                <span>Launch Tool</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BuildAiShell>
  );
};
