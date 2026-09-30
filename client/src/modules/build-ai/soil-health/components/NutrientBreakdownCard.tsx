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
    { label: 'Soil pH', icon: 'science', data: metrics.ph },
    { label: 'Nitrogen (N)', icon: 'eco', data: metrics.nitrogen },
    { label: 'Phosphorus (P)', icon: 'grass', data: metrics.phosphorus },
    { label: 'Potassium (K)', icon: 'grain', data: metrics.potassium },
    { label: 'Organic Carbon (OC)', icon: 'compost', data: metrics.organicCarbon }
  ];

  const getStatusColor = (status: string) => {
    if (status === 'OPTIMAL') return { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0' };
    if (status === 'MODERATE' || status === 'HIGH') return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
    return { bg: '#FEE2E2', text: '#B91C1C', border: '#FECACA' };
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      marginBottom: '1.25rem'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: '#0F172A', fontWeight: 800 }}>
        Nutrient & Soil Condition Breakdown
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {list.map((item, idx) => {
          const style = getStatusColor(item.data.status);
          return (
            <div key={idx} style={{
              background: '#F8FAFC',
              padding: '0.9rem 1rem',
              borderRadius: '12px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#16A34A' }}>{item.icon}</span>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>
                    {item.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                    {item.data.value} {item.data.unit}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: style.bg,
                    color: style.text,
                    border: `1px solid ${style.border}`
                  }}>
                    {item.data.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span>{item.data.description}</span>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Target: {item.data.idealRange}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
