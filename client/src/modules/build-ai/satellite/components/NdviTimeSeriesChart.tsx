import React, { useState } from 'react';
import { SatelliteObservation } from '../satellite.types.js';
import { useLanguage } from '../../../../context/LanguageContext.js';

interface NdviTimeSeriesChartProps {
  observations: SatelliteObservation[];
}

export const NdviTimeSeriesChart: React.FC<NdviTimeSeriesChartProps> = ({ observations }) => {
  const { t } = useLanguage();
  const [showTechnicalNdvi, setShowTechnicalNdvi] = useState<boolean>(false);
  const [activeObs, setActiveObs] = useState<SatelliteObservation | null>(
    observations && observations.length > 0 ? observations[observations.length - 1] : null
  );

  if (!observations || observations.length === 0) {
    return null;
  }

  const formatMonth = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('default', { month: 'short' });
    } catch {
      return dateStr;
    }
  };

  const currentObs = observations[observations.length - 1];
  const firstObs = observations[0];
  const isDeclining = currentObs.ndvi < (observations[observations.length - 2]?.ndvi || firstObs.ndvi);

  const getStatusDirection = (obs: SatelliteObservation, prevObs?: SatelliteObservation) => {
    if (!prevObs) return { icon: '•', color: '#16A34A', label: 'Start' };
    if (obs.ndvi > prevObs.ndvi + 0.02) return { icon: '↑', color: '#16A34A', label: t('buildAi.satellite.trendImproving') };
    if (obs.ndvi < prevObs.ndvi - 0.02) return { icon: '↓', color: '#DC2626', label: t('buildAi.satellite.trendDeclining') };
    return { icon: '→', color: '#16A34A', label: t('buildAi.satellite.trendStable') };
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '14px',
      padding: '0.85rem 1rem',
      border: '1.5px solid #EFEAE2',
      boxShadow: '0 1px 3px rgba(180, 83, 9, 0.03)',
      marginBottom: '0.75rem'
    }}>
      {/* Header with Current NDVI and Real Trend Direction */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.4rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#15803D' }}>trending_up</span>
            <h3 style={{ margin: 0, fontSize: '0.94rem', color: '#0F172A', fontWeight: 900 }}>
              {t('buildAi.satellite.trendTitle')}
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B' }}>
            {t('buildAi.cropHealthTrend')}
          </p>
        </div>

        {/* Dynamic Trend Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '3px 8px',
          borderRadius: '6px',
          background: isDeclining ? '#FEF2F2' : '#F0FDF4',
          border: `1px solid ${isDeclining ? '#FECACA' : '#BBF7D0'}`,
          fontSize: '0.72rem',
          fontWeight: 800,
          color: isDeclining ? '#DC2626' : '#15803D'
        }}>
          <span>{isDeclining ? `↓ ${t('buildAi.satellite.trendDeclining')}` : `↑ ${t('buildAi.satellite.trendImproving')}`}</span>
          <span style={{ color: '#475569', fontWeight: 600 }}>({currentObs.ndvi})</span>
        </div>
      </div>

      {/* Month Progression Timeline: Mar ─ Apr ─ May ─ Jun */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${observations.length}, 1fr)`,
        gap: '0.35rem',
        background: '#FDFBF7',
        padding: '0.55rem 0.5rem',
        borderRadius: '10px',
        border: '1px solid #EFEAE2',
        textAlign: 'center'
      }}>
        {observations.map((obs, idx) => {
          const prev = idx > 0 ? observations[idx - 1] : undefined;
          const trend = getStatusDirection(obs, prev);
          const isSelected = (activeObs?.date || currentObs.date) === obs.date;
          return (
            <div
              key={idx}
              onClick={() => setActiveObs(obs)}
              style={{
                cursor: 'pointer',
                background: isSelected ? '#DCFCE7' : 'transparent',
                borderRadius: '8px',
                padding: '4px 2px',
                border: isSelected ? '1px solid #86EFAC' : '1px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>
                {formatMonth(obs.date)}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: trend.color, margin: '1px 0' }}>
                {trend.icon}
              </div>
              <div style={{ fontSize: '0.64rem', color: '#334155', fontWeight: 700 }}>
                {obs.ndvi}
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapsible Detailed Curve Chart */}
      <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
        <button
          onClick={() => setShowTechnicalNdvi(!showTechnicalNdvi)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#15803D',
            fontSize: '0.7rem',
            fontWeight: 800,
            cursor: 'pointer',
            padding: 0
          }}
        >
          {showTechnicalNdvi ? `${t('buildAi.moreDetails')} ▲` : `${t('buildAi.moreDetails')} ▼`}
        </button>

        {showTechnicalNdvi && (
          <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginBottom: '0.35rem', fontWeight: 600 }}>
              <span>{activeObs?.date}</span>
              <span>NDVI: <strong style={{ color: '#15803D' }}>{activeObs?.ndvi}</strong></span>
            </div>

            <div style={{ width: '100%', height: '80px', background: '#F8FAFC', borderRadius: '8px', padding: '6px', boxSizing: 'border-box' }}>
              <svg viewBox="0 0 300 70" style={{ width: '100%', height: '100%' }}>
                <path
                  d={observations.map((obs, i) => {
                    const x = (i / (observations.length - 1 || 1)) * 260 + 20;
                    const y = 60 - (obs.ndvi * 50);
                    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                  }).join(' ')}
                  fill="none"
                  stroke={isDeclining ? '#DC2626' : '#16A34A'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {observations.map((obs, i) => {
                  const x = (i / (observations.length - 1 || 1)) * 260 + 20;
                  const y = 60 - (obs.ndvi * 50);
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={(activeObs?.date || currentObs.date) === obs.date ? 5 : 3}
                      fill={(activeObs?.date || currentObs.date) === obs.date ? '#15803D' : '#22C55E'}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
