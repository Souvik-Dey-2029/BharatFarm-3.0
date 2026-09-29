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
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#F87171', fontWeight: 700 }}>
            ⚠️ Soil Health Warnings & Deficiencies
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {warnings.map((w, idx) => (
              <div key={idx} style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.85)', display: 'flex', gap: '0.4rem' }}>
                <span style={{ color: '#F87171' }}>•</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Card */}
      <div style={{
        background: 'var(--surface-card, #12281a)',
        borderRadius: '16px',
        padding: '1.25rem',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary, #fff)', fontWeight: 700 }}>
            💡 Actionable Soil Restoration & Fertilization Plan
          </h3>

          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '12px',
            background: source === 'live_ai' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            color: source === 'live_ai' ? '#34D399' : '#FBBF24',
            border: `1px solid ${source === 'live_ai' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
          }}>
            {source === 'live_ai' ? 'LIVE AI ADVISORY' : 'DETERMINISTIC ANALYSIS'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
          {recommendations.map((rec, idx) => (
            <div key={idx} style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#34D399' }}>
                  {idx + 1}. {rec.title}
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '6px',
                  background: rec.actionPriority === 'HIGH' || rec.actionPriority === 'URGENT' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)',
                  color: rec.actionPriority === 'HIGH' || rec.actionPriority === 'URGENT' ? '#F87171' : 'rgba(255,255,255,0.7)'
                }}>
                  {rec.actionPriority}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.45 }}>
                {rec.description}
              </p>
            </div>
          ))}
        </div>

        {/* Advisory Disclaimer */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '0.75rem',
          borderRadius: '10px',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '1.25rem',
          lineHeight: 1.4
        }}>
          📌 <strong>Advisory Disclaimer:</strong> Soil health scores and fertilizer dosages are AI decision support recommendations based on reported lab values. For exact application rates, cross-reference with official Krishi Vigyan Kendra (KVK) guidelines.
        </div>

        {/* Deep-Links */}
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
              cursor: 'pointer'
            }}
          >
            🛒 Source Inputs on Marketplace
          </button>
          <button
            onClick={() => navigate('/build-ai/satellite')}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            📡 View Satellite Vegetation Health
          </button>
        </div>
      </div>
    </div>
  );
};
