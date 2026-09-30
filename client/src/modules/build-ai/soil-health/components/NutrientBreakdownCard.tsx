import React, { useState } from 'react';
import { MetricDetail } from '../types.js';
import { useLanguage } from '../../../../context/LanguageContext.js';
import { tokens } from '../../theme.js';

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

  const nutrientBars = [
    {
      name: 'pH',
      valueStr: `${metrics.ph.value}`,
      percent: Math.min(100, Math.max(10, ((metrics.ph.value - 4) / 4) * 100)),
      status: metrics.ph.status === 'OPTIMAL' ? 'Optimal' : metrics.ph.status === 'LOW' ? 'Low' : 'High',
      color: metrics.ph.status === 'OPTIMAL' ? tokens.colors.primaryLeaf : tokens.colors.statusWatch,
      target: metrics.ph.idealRange
    },
    {
      name: 'Nitrogen',
      valueStr: `${metrics.nitrogen.value} kg/ha`,
      percent: Math.min(100, Math.max(10, (metrics.nitrogen.value / 400) * 100)),
      status: metrics.nitrogen.status === 'OPTIMAL' ? 'Good' : metrics.nitrogen.status === 'LOW' ? 'Low' : 'High',
      color: metrics.nitrogen.status === 'OPTIMAL' ? tokens.colors.primaryLeaf : tokens.colors.clay,
      target: metrics.nitrogen.idealRange
    },
    {
      name: 'Phosphorus',
      valueStr: `${metrics.phosphorus.value} kg/ha`,
      percent: Math.min(100, Math.max(10, (metrics.phosphorus.value / 40) * 100)),
      status: metrics.phosphorus.status === 'OPTIMAL' ? 'Good' : metrics.phosphorus.status === 'LOW' ? 'Low' : 'High',
      color: metrics.phosphorus.status === 'OPTIMAL' ? tokens.colors.primaryLeaf : tokens.colors.clay,
      target: metrics.phosphorus.idealRange
    },
    {
      name: 'Potassium',
      valueStr: `${metrics.potassium.value} kg/ha`,
      percent: Math.min(100, Math.max(10, (metrics.potassium.value / 300) * 100)),
      status: metrics.potassium.status === 'OPTIMAL' ? 'Good' : 'Moderate',
      color: tokens.colors.primaryLeaf,
      target: metrics.potassium.idealRange
    },
    {
      name: 'Organic Carbon',
      valueStr: `${metrics.organicCarbon.value}%`,
      percent: Math.min(100, Math.max(10, (metrics.organicCarbon.value / 1.0) * 100)),
      status: metrics.organicCarbon.status === 'OPTIMAL' ? 'Good' : 'Low',
      color: metrics.organicCarbon.status === 'OPTIMAL' ? tokens.colors.primaryLeaf : tokens.colors.earth,
      target: metrics.organicCarbon.idealRange
    }
  ];

  return (
    <div style={{
      background: tokens.colors.surfaceLight,
      borderRadius: tokens.radii.md,
      padding: '0.9rem 1rem',
      border: `1.5px solid ${tokens.colors.borderDefault}`,
      boxShadow: tokens.shadows.subtle
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: tokens.colors.clay }}>science</span>
          <h3 style={{ margin: 0, fontSize: '0.94rem', color: tokens.colors.textPrimary, fontWeight: 800 }}>
            {t('buildAi.soil.nutrientLevelsTitle')}
          </h3>
        </div>

        <button
          onClick={() => setShowTargets(!showTargets)}
          style={{
            background: 'transparent',
            border: 'none',
            color: tokens.colors.primaryLeaf,
            fontSize: tokens.typography.micro,
            fontWeight: 800,
            cursor: 'pointer',
            padding: 0
          }}
        >
          {showTargets ? t('buildAi.soil.hideTargets') : t('buildAi.soil.showDetails')}
        </button>
      </div>

      {/* ONE Unified Visual Diagnostic Panel (No nested mini-cards) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}>
        {nutrientBars.map((item, idx) => {
          const localizedName = idx === 0 ? t('buildAi.soilPh') : idx === 1 ? t('buildAi.nitrogen') : idx === 2 ? t('buildAi.phosphorus') : idx === 3 ? t('buildAi.potassium') : t('buildAi.organicCarbon');
          const localizedStatus = item.status === 'Optimal' ? t('buildAi.optimal') : item.status === 'Good' ? t('buildAi.good') : item.status === 'Moderate' ? t('buildAi.moderate') : t('buildAi.low');
          const isLast = idx === nutrientBars.length - 1;

          return (
            <div
              key={idx}
              style={{
                paddingBottom: isLast ? '0' : '0.65rem',
                borderBottom: isLast ? 'none' : '1px solid #F1F5F9'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: tokens.typography.small }}>
                <span style={{ fontWeight: 800, color: tokens.colors.textPrimary }}>{localizedName}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontWeight: 700, color: tokens.colors.textSecondary, fontSize: tokens.typography.micro }}>{item.valueStr}</span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: tokens.radii.xs,
                    background: item.color === tokens.colors.primaryLeaf ? tokens.colors.statusGoodBg : tokens.colors.statusWatchBg,
                    color: item.color === tokens.colors.primaryLeaf ? tokens.colors.statusGood : tokens.colors.statusWatch
                  }}>
                    {localizedStatus}
                  </span>
                </div>
              </div>

              {/* Seamless Indicator Bar */}
              <div style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: '#E2E8F0',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${item.percent}%`,
                  height: '100%',
                  background: item.color,
                  borderRadius: '3px',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {showTargets && (
                <div style={{ fontSize: '10px', color: tokens.colors.textMuted, marginTop: '3px', fontWeight: 600 }}>
                  {t('buildAi.soil.optimalRange')}: {item.target}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
