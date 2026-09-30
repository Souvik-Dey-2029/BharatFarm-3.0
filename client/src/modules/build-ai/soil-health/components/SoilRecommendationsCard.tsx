import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SoilRecommendation } from '../types.js';

interface SoilRecommendationsCardProps {
  recommendations: SoilRecommendation[];
  warnings: string[];
  source: 'live_ai' | 'deterministic';
}

export const SoilRecommendationsCard: React.FC<SoilRecommendationsCardProps> = ({
  recommendations,
  warnings,
  source
}) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
      {/* Warnings & Risk Flags */}
      {warnings && warnings.length > 0 && (
        <div style={{
          background: '#FEF2F2',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #FECACA'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.98rem', color: '#991B1B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>warning</span>
            <span>Soil Health Warnings & Deficiencies</span>
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {warnings.map((w, idx) => (
              <div key={idx} style={{ fontSize: '0.84rem', color: '#7F1D1D', display: 'flex', gap: '0.4rem' }}>
                <span>•</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F172A', fontWeight: 800 }}>
            Practical Regenerative Recommendations
          </h3>

          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '12px',
            background: source === 'live_ai' ? '#DCFCE7' : '#E0F2FE',
            color: source === 'live_ai' ? '#15803D' : '#0369A1',
            border: `1px solid ${source === 'live_ai' ? '#BBF7D0' : '#BAE6FD'}`
          }}>
            {source === 'live_ai' ? 'LIVE AI INTERPRETATION' : 'MEASURED DATA INTERPRETATION'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
          {recommendations.map((rec, idx) => (
            <div key={idx} style={{
              background: '#F8FAFC',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0F172A' }}>
                  {idx + 1}. {rec.title}
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: rec.actionPriority === 'HIGH' || rec.actionPriority === 'URGENT' ? '#FEE2E2' : '#F1F5F9',
                  color: rec.actionPriority === 'HIGH' || rec.actionPriority === 'URGENT' ? '#B91C1C' : '#475569'
                }}>
                  Priority: {rec.actionPriority}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                {rec.description}
              </p>
            </div>
          ))}
        </div>

        {/* Connected Tool CTA */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
          <button
            onClick={() => navigate('/build-ai/regenerative-ai')}
            style={{
              padding: '0.55rem 1.1rem',
              background: '#16A34A',
              color: '#FFFFFF',
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
            <span>Proceed to Regenerative AI Plan</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </button>
          <button
            onClick={() => navigate('/build-ai/satellite')}
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
            <span>View Satellite Telemetry</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>satellite_alt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
