import React from 'react';
import { SoilAnalysisResult } from '../types.js';

interface SoilScoreGaugeProps {
  result: SoilAnalysisResult;
}

export const SoilScoreGauge: React.FC<SoilScoreGaugeProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#34D399'; // Green
    if (score >= 65) return '#A3E635'; // Light Green
    if (score >= 50) return '#FBBF24'; // Yellow
    return '#F87171'; // Red
  };

  const getStatusBadge = (status: string) => {
    const formatted = status.replace('_', ' ');
    return formatted.toUpperCase();
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1rem',
      marginBottom: '1.25rem'
    }}>
      {/* Overall Score */}
      <div style={{
        background: 'var(--surface-card, #12281a)',
        borderRadius: '16px',
        padding: '1.25rem',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        {/* Circle Score Gauge */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          border: `6px solid ${getScoreColor(result.score)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
            {result.score}
          </span>
        </div>

        <div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
            Soil Health Index
          </div>
          <div style={{
            fontSize: '0.95rem',
            fontWeight: 800,
            color: getScoreColor(result.score),
            marginTop: '2px'
          }}>
            {getStatusBadge(result.nutrientStatus)}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
            Composite NPK + pH + OC index
          </div>
        </div>
      </div>

      {/* Crop Suitability Context */}
      <div style={{
        background: 'var(--surface-card, #12281a)',
        borderRadius: '16px',
        padding: '1.25rem',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
      }}>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
          Crop Suitability ({result.cropContext.crop})
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>
          {result.cropContext.suitabilityScore} / 100
        </div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', marginTop: '4px', lineHeight: 1.4 }}>
          {result.cropContext.summary}
        </div>
      </div>
    </div>
  );
};
