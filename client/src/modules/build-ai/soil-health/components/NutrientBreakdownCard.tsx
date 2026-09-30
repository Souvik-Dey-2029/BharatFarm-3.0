import React from 'react';
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

  const list = [
    { label: t('buildAi.soilPh'), icon: 'science', data: metrics.ph },
    { label: t('buildAi.nitrogen'), icon: 'eco', data: metrics.nitrogen },
    { label: t('buildAi.phosphorus'), icon: 'grass', data: metrics.phosphorus },
    { label: t('buildAi.potassium'), icon: 'grain', data: metrics.potassium },
    { label: t('buildAi.organicCarbon'), icon: 'compost', data: metrics.organicCarbon }
  ];

  const getStatusColor = (status: string) => {
    if (status === 'OPTIMAL') return { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0', label: t('buildAi.optimal') };
    if (status === 'MODERATE' || status === 'HIGH') return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A', label: t('buildAi.good') };
    return { bg: '#FEE2E2', text: '#B91C1C', border: '#FECACA', label: t('buildAi.low') };
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '14px',
      padding: '0.85rem 1rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      marginBottom: '0.85rem'
    }}>
      <h3 style={{ margin: '0 0 0.65rem 0', fontSize: '0.94rem', color: '#0F172A', fontWeight: 800 }}>
        Nutrient Breakdown
      </h3>

      {/* 2-Column Responsive Compact Grid for Nutrients */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.55rem'
      }}>
        {list.map((item, idx) => {
          const style = getStatusColor(item.data.status);
          const isFullWidth = idx === list.length - 1; // Organic carbon full-width if odd
          return (
            <div
              key={idx}
              style={{
                gridColumn: isFullWidth ? 'span 2' : 'span 1',
                background: '#F8FAFC',
                padding: '0.65rem 0.75rem',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.35rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0F172A' }}>
                  {item.label}
                </span>
                <span style={{
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '6px',
                  background: style.bg,
                  color: style.text,
                  border: `1px solid ${style.border}`
                }}>
                  {style.label}
                </span>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A' }}>
                {item.data.value} <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>{item.data.unit}</span>
              </div>

              <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 500 }}>
                Target: {item.data.idealRange}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
