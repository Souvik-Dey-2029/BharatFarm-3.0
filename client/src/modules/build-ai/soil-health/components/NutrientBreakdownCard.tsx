import React from 'react';
import { MetricDetail } from '../types.js';

interface NutrientBreakdownCardProps {
  metrics: {
    ph: MetricDetail;
    nitrogen: MetricDetail;
    phosphorus: MetricDetail;
    potassium: MetricDetail;
    organicCarbon: MetricDetail;
  };
}

export const NutrientBreakdownCard: React.FC<NutrientBreakdownCardProps> = ({ metrics }) => {
  const list = [
    { label: 'Soil pH', icon: '🧪', data: metrics.ph },
    { label: 'Nitrogen (N)', icon: '🌿', data: metrics.nitrogen },
    { label: 'Phosphorus (P)', icon: '🌱', data: metrics.phosphorus },
    { label: 'Potassium (K)', icon: '🌾', data: metrics.potassium },
    { label: 'Organic Carbon (OC)', icon: '🪱', data: metrics.organicCarbon }
  ];

  const getStatusColor = (status: string) => {
    if (status === 'OPTIMAL') return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ADE80', border: 'rgba(34, 197, 94, 0.3)' };
    if (status === 'MODERATE' || status === 'HIGH') return { bg: 'rgba(234, 179, 8, 0.15)', text: '#FBBF24', border: 'rgba(234, 179, 8, 0.3)' };
    return { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' };
  };

  return (
    <div style={{
      background: 'var(--surface-card, #12281a)',
      borderRadius: '16px',
      padding: '1.25rem',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      marginBottom: '1.25rem'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: 'var(--text-primary, #fff)', fontWeight: 700 }}>
        📊 Nutrient & Sub-Indicator Breakdown
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {list.map((item, idx) => {
          const style = getStatusColor(item.data.status);
          return (
            <div key={idx} style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{item.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                    {item.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
                    {item.data.value} {item.data.unit}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: style.bg,
                    color: style.text,
                    border: `1px solid ${style.border}`
                  }}>
                    {item.data.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <span>{item.data.description}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>Target: {item.data.idealRange}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
