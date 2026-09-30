import React, { useState } from 'react';
import { MetricDetail } from '../types.js';
import { useLanguage } from '../../../../context/LanguageContext.js';

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
  const { t } = useLanguage();
  const [showTargets, setShowTargets] = useState<boolean>(false);

  // Map each nutrient to a normalized percentage (0-100%) for progress bars
  const nutrientBars = [
    {
      name: 'pH',
      valueStr: `${metrics.ph.value}`,
      percent: Math.min(100, Math.max(10, ((metrics.ph.value - 4) / 4) * 100)),
      status: metrics.ph.status === 'OPTIMAL' ? 'Optimal' : metrics.ph.status === 'LOW' ? 'Low' : 'High',
      color: metrics.ph.status === 'OPTIMAL' ? '#16A34A' : '#D97706',
      target: metrics.ph.idealRange
    },
    {
      name: 'Nitrogen',
      valueStr: `${metrics.nitrogen.value} kg/ha`,
      percent: Math.min(100, Math.max(10, (metrics.nitrogen.value / 400) * 100)),
      status: metrics.nitrogen.status === 'OPTIMAL' ? 'Good' : metrics.nitrogen.status === 'LOW' ? 'Low' : 'High',
      color: metrics.nitrogen.status === 'OPTIMAL' ? '#16A34A' : '#DC2626',
      target: metrics.nitrogen.idealRange
    },
    {
      name: 'Phosphorus',
      valueStr: `${metrics.phosphorus.value} kg/ha`,
      percent: Math.min(100, Math.max(10, (metrics.phosphorus.value / 40) * 100)),
      status: metrics.phosphorus.status === 'OPTIMAL' ? 'Good' : metrics.phosphorus.status === 'LOW' ? 'Low' : 'High',
      color: metrics.phosphorus.status === 'OPTIMAL' ? '#16A34A' : '#DC2626',
      target: metrics.phosphorus.idealRange
    },
    {
      name: 'Potassium',
      valueStr: `${metrics.potassium.value} kg/ha`,
      percent: Math.min(100, Math.max(10, (metrics.potassium.value / 300) * 100)),
      status: metrics.potassium.status === 'OPTIMAL' ? 'Good' : 'Moderate',
      color: '#16A34A',
      target: metrics.potassium.idealRange
    },
    {
      name: 'Organic Carbon',
      valueStr: `${metrics.organicCarbon.value}%`,
      percent: Math.min(100, Math.max(10, (metrics.organicCarbon.value / 1.0) * 100)),
      status: metrics.organicCarbon.status === 'OPTIMAL' ? 'Good' : 'Low',
      color: metrics.organicCarbon.status === 'OPTIMAL' ? '#16A34A' : '#D97706',
      target: metrics.organicCarbon.idealRange
    }
  ];

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '14px',
      padding: '0.85rem 1rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      marginBottom: '0.75rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <h3 style={{ margin: 0, fontSize: '0.94rem', color: '#0F172A', fontWeight: 800 }}>
          📊 Nutrient Levels
        </h3>
        <button
          onClick={() => setShowTargets(!showTargets)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#15803D',
            fontSize: '0.72rem',
            fontWeight: 800,
            cursor: 'pointer',
            padding: 0
          }}
        >
          {showTargets ? 'Hide targets ▲' : 'Details →'}
        </button>
      </div>

      {/* Visual Nutrient Health Progress Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {nutrientBars.map((item, idx) => (
          <div key={idx} style={{ background: '#F8FAFC', padding: '0.55rem 0.65rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.78rem' }}>
              <span style={{ fontWeight: 800, color: '#0F172A' }}>{item.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.74rem' }}>{item.valueStr}</span>
                <span style={{
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: item.color === '#16A34A' ? '#DCFCE7' : item.color === '#D97706' ? '#FEF3C7' : '#FEE2E2',
                  color: item.color
                }}>
                  {item.status}
                </span>
              </div>
            </div>

            {/* Visual Bar Indicator */}
            <div style={{
              width: '100%',
              height: '7px',
              borderRadius: '4px',
              background: '#E2E8F0',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${item.percent}%`,
                height: '100%',
                background: item.color,
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>

            {showTargets && (
              <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '3px', fontWeight: 600 }}>
                Optimal range: {item.target}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
