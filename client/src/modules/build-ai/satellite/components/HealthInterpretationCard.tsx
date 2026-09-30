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
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '12px',
            background: '#DCFCE7',
            color: '#15803D',
            border: '1px solid #BBF7D0'
          }}>
            Actionable Vegetation Interpretation
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: interpretation.actionPriority === 'HIGH' || interpretation.actionPriority === 'URGENT' ? '#B91C1C' : '#475569',
            background: interpretation.actionPriority === 'HIGH' || interpretation.actionPriority === 'URGENT' ? '#FEE2E2' : '#F1F5F9',
            padding: '3px 8px',
            borderRadius: '6px'
          }}>
            Action Priority: {interpretation.actionPriority}
          </span>
        </div>

        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#0F172A', fontWeight: 800 }}>
          {interpretation.headline}
        </h4>

        <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.9rem', color: '#334155', lineHeight: 1.55 }}>
          {interpretation.summary}
        </p>

        {/* Farmer-Friendly Observations */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ background: '#F0F9FF', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
            <div style={{ fontSize: '0.75rem', color: '#0369A1', fontWeight: 700 }}>💧 Soil Moisture & Water Canopy</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0284C7', marginTop: '3px' }}>{interpretation.waterStatus}</div>
          </div>
          <div style={{ background: '#F0FDF4', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700 }}>🌱 Estimated Canopy Nitrogen</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#16A34A', marginTop: '3px' }}>{interpretation.nitrogenLevel}</div>
          </div>
        </div>

        {/* Practical Farmer Next Steps */}
        <h5 style={{ margin: '0 0 0.6rem 0', fontSize: '0.92rem', color: '#0F172A', fontWeight: 800 }}>
          What to check next in your field:
        </h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {interpretation.recommendations.map((rec, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              fontSize: '0.86rem',
              color: '#334155',
              background: '#F8FAFC',
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid #E2E8F0'
            }}>
              <span style={{ color: '#16A34A', fontWeight: 800, fontSize: '1rem' }}>✓</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>

        {/* Connected Tool CTA */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
          <button
            onClick={() => navigate('/build-ai/soil-health')}
            style={{
              padding: '0.55rem 1.1rem',
              background: '#16A34A',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span>Check Soil Health</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </button>
          <button
            onClick={() => navigate('/build-ai/regenerative-ai')}
            style={{
              padding: '0.55rem 1.1rem',
              background: '#F8FAFC',
              color: '#0F172A',
              border: '1.5px solid #CBD5E1',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span>Generate Regenerative Plan</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Observation Metadata */}
      <div style={{
        background: '#F8FAFC',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        border: '1px solid #E2E8F0',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.78rem',
        color: '#64748B'
      }}>
        <div><strong style={{ color: '#0F172A' }}>Sensor:</strong> {modelMetadata.satellite} ({modelMetadata.resolution})</div>
        <div><strong style={{ color: '#0F172A' }}>Provider:</strong> {modelMetadata.provider}</div>
        <div><strong style={{ color: '#0F172A' }}>Bands:</strong> {modelMetadata.bandCombination}</div>
        <div><strong style={{ color: '#0F172A' }}>Frequency:</strong> {modelMetadata.updateFrequency}</div>
      </div>
    </div>
  );
};
