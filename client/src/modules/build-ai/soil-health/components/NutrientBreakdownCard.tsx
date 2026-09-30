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

  const nutrientCircles = [
    {
      key: 'ph',
      name: t('buildAi.soilPh'),
      valueOnly: `${metrics.ph.value}`,
      unit: 'pH',
      percent: Math.min(100, Math.max(15, (metrics.ph.value / 8.5) * 100)),
      status: metrics.ph.status === 'OPTIMAL' ? 'Optimal' : metrics.ph.status === 'LOW' ? 'Low' : 'High',
      color: metrics.ph.status === 'OPTIMAL' ? '#15803D' : '#D97706',
      target: metrics.ph.idealRange
    },
    {
      key: 'nitrogen',
      name: t('buildAi.nitrogen'),
      valueOnly: `${metrics.nitrogen.value}`,
      unit: 'kg/ha',
      percent: Math.min(100, Math.max(15, (metrics.nitrogen.value / 400) * 100)),
      status: metrics.nitrogen.status === 'OPTIMAL' ? 'Good' : metrics.nitrogen.status === 'LOW' ? 'Low' : 'High',
      color: metrics.nitrogen.status === 'OPTIMAL' ? '#15803D' : '#B45F43',
      target: metrics.nitrogen.idealRange
    },
    {
      key: 'phosphorus',
      name: t('buildAi.phosphorus'),
      valueOnly: `${metrics.phosphorus.value}`,
      unit: 'kg/ha',
      percent: Math.min(100, Math.max(15, (metrics.phosphorus.value / 40) * 100)),
      status: metrics.phosphorus.status === 'OPTIMAL' ? 'Good' : metrics.phosphorus.status === 'LOW' ? 'Low' : 'High',
      color: metrics.phosphorus.status === 'OPTIMAL' ? '#15803D' : '#B45F43',
      target: metrics.phosphorus.idealRange
    },
    {
      key: 'potassium',
      name: t('buildAi.potassium'),
      valueOnly: `${metrics.potassium.value}`,
      unit: 'kg/ha',
      percent: Math.min(100, Math.max(15, (metrics.potassium.value / 280) * 100)),
      status: metrics.potassium.status === 'OPTIMAL' ? 'Good' : 'Moderate',
      color: '#15803D',
      target: metrics.potassium.idealRange
    },
    {
      key: 'organicCarbon',
      name: t('buildAi.organicCarbon'),
      valueOnly: `${metrics.organicCarbon.value}%`,
      unit: 'OC',
      percent: Math.min(100, Math.max(15, (metrics.organicCarbon.value / 1.0) * 100)),
      status: metrics.organicCarbon.status === 'OPTIMAL' ? 'Good' : 'Low',
      color: metrics.organicCarbon.status === 'OPTIMAL' ? '#15803D' : '#854D0E',
      target: metrics.organicCarbon.idealRange
    }
  ];

  const getLocalizedStatus = (status: string) => {
    if (status === 'Optimal') return t('buildAi.optimal');
    if (status === 'Good') return t('buildAi.good');
    if (status === 'Moderate') return t('buildAi.moderate');
    return t('buildAi.low');
  };

  // SVG circular ring geometry constants
  const size = 76;
  const strokeWidth = 6;
  const center = size / 2; // 38
  const radius = center - strokeWidth / 2 - 2; // 38 - 3 - 2 = 33
  const circumference = 2 * Math.PI * radius; // ~207.34

  return (
    <div style={{
      background: tokens.colors.surfaceLight,
      borderRadius: tokens.radii.md,
      padding: '0.9rem 1rem',
      border: `1.5px solid ${tokens.colors.borderDefault}`,
      boxShadow: tokens.shadows.subtle
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
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

      {/* 2 Circles per row grid layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem',
        alignItems: 'stretch'
      }}>
        {nutrientCircles.map((item, idx) => {
          const localizedStatus = getLocalizedStatus(item.status);
          const isGood = item.status === 'Optimal' || item.status === 'Good';
          const badgeBg = isGood ? tokens.colors.statusGoodBg : tokens.colors.statusWatchBg;
          const badgeColor = isGood ? tokens.colors.statusGood : tokens.colors.statusWatch;
          const isLast = idx === nutrientCircles.length - 1;
          const strokeDashoffset = circumference * (1 - item.percent / 100);

          return (
            <div
              key={item.key}
              style={{
                background: tokens.colors.surfaceAlt,
                borderRadius: tokens.radii.sm,
                border: `1px solid ${tokens.colors.borderDefault}`,
                padding: '0.85rem 0.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxSizing: 'border-box',
                ...(isLast ? {
                  gridColumn: '1 / -1',
                  maxWidth: '220px',
                  width: '100%',
                  margin: '0 auto'
                } : {})
              }}
            >
              {/* Circular Gauge SVG */}
              <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
                <svg
                  width={size}
                  height={size}
                  viewBox={`0 0 ${size} ${size}`}
                  style={{ display: 'block' }}
                >
                  {/* Background Track */}
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#E2E8F0"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  {/* Active Progress Ring */}
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${center} ${center})`}
                    fill="transparent"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                  {/* Inside Circle: Value & Unit */}
                  <text
                    x={center}
                    y={center - 2}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="900"
                    fill={tokens.colors.textPrimary}
                  >
                    {item.valueOnly}
                  </text>
                  <text
                    x={center}
                    y={center + 11}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="700"
                    fill={tokens.colors.textMuted}
                  >
                    {item.unit}
                  </text>
                </svg>
              </div>

              {/* Nutrient Name */}
              <div style={{
                fontWeight: 800,
                fontSize: '0.8rem',
                color: tokens.colors.textPrimary,
                marginTop: '0.4rem',
                lineHeight: 1.2
              }}>
                {item.name}
              </div>

              {/* Status Badge */}
              <span style={{
                display: 'inline-block',
                marginTop: '0.3rem',
                fontSize: '10px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: tokens.radii.xs,
                background: badgeBg,
                color: badgeColor
              }}>
                {localizedStatus}
              </span>

              {/* Optional Target Range */}
              {showTargets && (
                <div style={{
                  fontSize: '9.5px',
                  color: tokens.colors.textMuted,
                  marginTop: '0.35rem',
                  fontWeight: 600,
                  lineHeight: 1.2
                }}>
                  {t('buildAi.soil.optimalRange')}:<br />
                  <strong style={{ color: tokens.colors.textSecondary }}>{item.target}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
