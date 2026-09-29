import React from 'react';
import { ImpactSummaryData } from '../types.js';

interface Props {
  kpis: ImpactSummaryData['kpis'];
}

export const ImpactKpiGrid: React.FC<Props> = ({ kpis }) => {
  const cards = [
    {
      title: 'Yield Improvement',
      value: `+${kpis.yieldImprovementPercent}%`,
      unit: 'vs baseline harvest',
      badge: 'Measured',
      badgeColor: '#34d399',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.25)',
      icon: '🌾'
    },
    {
      title: 'Soil Health Score',
      value: `${kpis.soilHealthScore}/100`,
      unit: 'High Fertility Index',
      badge: 'Lab Tested',
      badgeColor: '#60a5fa',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.25)',
      icon: '🌱'
    },
    {
      title: 'Groundwater Saved',
      value: `${(kpis.waterSavedLitersPerHa / 1000).toFixed(0)}k L`,
      unit: 'per hectare / season',
      badge: 'API Derived',
      badgeColor: '#38bdf8',
      bgColor: 'rgba(56, 189, 248, 0.1)',
      borderColor: 'rgba(56, 189, 248, 0.25)',
      icon: '💧'
    },
    {
      title: 'Climate Risk Reduction',
      value: `-${kpis.riskReductionIndexPercent}%`,
      unit: 'vulnerability score drop',
      badge: 'Model Est.',
      badgeColor: '#a78bfa',
      bgColor: 'rgba(167, 139, 250, 0.1)',
      borderColor: 'rgba(167, 139, 250, 0.25)',
      icon: '🛡️'
    },
    {
      title: 'Carbon Sequestration',
      value: `${kpis.estimatedCarbonOffsetTons} t`,
      unit: 'CO2e / ha / year',
      badge: 'Demo Baseline',
      badgeColor: '#fbbf24',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.25)',
      icon: '🌲'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      {cards.map((card, idx) => (
        <div
          key={idx}
          style={{
            background: card.bgColor,
            border: `1px solid ${card.borderColor}`,
            borderRadius: '14px',
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>{card.icon}</span>
            <span style={{
              background: 'rgba(0,0,0,0.4)',
              color: card.badgeColor,
              border: `1px solid ${card.badgeColor}40`,
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              fontSize: '0.68rem',
              fontWeight: 600
            }}>
              {card.badge}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.2rem' }}>
              {card.title}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '0.725rem', color: '#6b7280', marginTop: '0.15rem' }}>
              {card.unit}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
