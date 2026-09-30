import React from 'react';
import { SoilAnalysisResult } from '../types.js';

interface SoilScoreGaugeProps {
  result: SoilAnalysisResult;
}

export const SoilScoreGauge: React.FC<SoilScoreGaugeProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#16A34A'; // Green
    if (score >= 65) return '#65A30D'; // Light Green
    if (score >= 50) return '#D97706'; // Yellow/Amber
    return '#DC2626'; // Red
  };

  const getStatusBadge = (status: string) => {
    return status.replace(/_/g, ' ').toUpperCase();
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
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '1.25rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        {/* Circle Score Gauge */}
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          border: `5px solid ${getScoreColor(result.score)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: '#F8FAFC'
        }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>
            {result.score}
          </span>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Soil Health Index
          </div>
          <div style={{
            fontSize: '1rem',
            fontWeight: 900,
            color: getScoreColor(result.score),
            marginTop: '2px'
          }}>
            {getStatusBadge(result.nutrientStatus)}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
            Composite NPK + pH + Organic Carbon
          </div>
        </div>
      </div>

      {/* Crop Suitability Context */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '1.25rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Crop Suitability ({result.cropContext.crop})
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0284C7', marginTop: '2px' }}>
          {result.cropContext.suitabilityScore} / 100
        </div>
        <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px', lineHeight: 1.45, fontWeight: 500 }}>
          {result.cropContext.summary}
        </div>
      </div>
    </div>
  );
};
