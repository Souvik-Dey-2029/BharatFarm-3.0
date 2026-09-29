import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HealthInterpretationCardProps {
  interpretation: {
    headline: string;
    summary: string;
    recommendations: string[];
    waterStatus: string;
    nitrogenLevel: string;
    actionPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  };
  modelMetadata: {
    provider: string;
    satellite: string;
    resolution: string;
    bandCombination: string;
    cloudCoverMax: string;
    updateFrequency: string;
  };
}

export const HealthInterpretationCard: React.FC<HealthInterpretationCardProps> = ({ interpretation, modelMetadata }) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
      {/* Agronomic Interpretation Card */}
      <div style={{
        background: 'var(--surface-card, #12281a)',
        borderRadius: '16px',
        padding: '1.25rem',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '12px',
            background: 'rgba(22, 163, 74, 0.2)',
            color: '#34D399',
            border: '1px solid rgba(52, 211, 153, 0.3)'
          }}>
            AI Agronomic Insights
          </span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
            Priority: {interpretation.actionPriority}
          </span>
        </div>

        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-primary, #fff)', fontWeight: 700 }}>
          {interpretation.headline}
        </h4>

        <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
          {interpretation.summary}
        </p>

        {/* Quick Vitals Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>💧 Soil Moisture</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38BDF8', marginTop: '2px' }}>{interpretation.waterStatus}</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>🌱 Canopy Nitrogen</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4ADE80', marginTop: '2px' }}>{interpretation.nitrogenLevel}</div>
          </div>
        </div>

        {/* Recommended Actions Checklist */}
        <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
          Recommended Next Steps:
        </h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {interpretation.recommendations.map((rec, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontSize: '0.84rem',
              color: 'rgba(255,255,255,0.85)',
              background: 'rgba(255,255,255,0.03)',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px'
            }}>
              <span style={{ color: '#34D399', fontWeight: 700 }}>✓</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>

        {/* Action Deep-Links */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/sih/smart-mandi')}
            style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            📈 Check Smart Mandi Prices
          </button>
          <button
            onClick={() => navigate('/sih/sahayak')}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            💬 Consult Sahayak AI Assistant
          </button>
        </div>
      </div>

      {/* Model Cards & Transparency Info */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem' }}>
          📋 Data Source & Model Card Provenance
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
          <div><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Provider:</strong> {modelMetadata.provider}</div>
          <div><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Satellite:</strong> {modelMetadata.satellite}</div>
          <div><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Resolution:</strong> {modelMetadata.resolution}</div>
          <div><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Band Index:</strong> {modelMetadata.bandCombination}</div>
        </div>
      </div>
    </div>
  );
};
