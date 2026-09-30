import React, { useState } from 'react';
import { SatelliteObservation } from '../satellite.types.js';

interface NdviTimeSeriesChartProps {
  observations: SatelliteObservation[];
}

export const NdviTimeSeriesChart: React.FC<NdviTimeSeriesChartProps> = ({ observations }) => {
  const [showTechnicalNdvi, setShowTechnicalNdvi] = useState<boolean>(false);
  const [activeObs, setActiveObs] = useState<SatelliteObservation | null>(
    observations && observations.length > 0 ? observations[observations.length - 1] : null
  );

  if (!observations || observations.length === 0) {
    return null;
  }

  // Format observations into simple month timeline: Mar ─ Apr ─ May ─ Jun
  const formatMonth = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('default', { month: 'short' });
    } catch {
      return dateStr;
    }
  };

  const getStatusDirection = (obs: SatelliteObservation, prevObs?: SatelliteObservation) => {
    if (!prevObs) return { icon: '•', color: '#16A34A', label: 'Stable' };
    if (obs.ndvi > prevObs.ndvi + 0.03) return { icon: '↑', color: '#16A34A', label: 'Growing' };
    if (obs.ndvi < prevObs.ndvi - 0.03) return { icon: '↓', color: '#DC2626', label: 'Dropping' };
    return { icon: '→', color: '#16A34A', label: 'Stable' };
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '14px',
      padding: '0.85rem 1rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      marginBottom: '0.75rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.3rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '0.94rem', color: '#0F172A', fontWeight: 800 }}>
            📈 Crop Growth Over Time
          </h3>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B' }}>
            Bi-weekly satellite monitoring
          </p>
        </div>

        <button
          onClick={() => setShowTechnicalNdvi(!showTechnicalNdvi)}
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
          {showTechnicalNdvi ? 'Hide chart ▲' : 'View chart ▼'}
        </button>
      </div>

      {/* Concept: Mar ─ Apr ─ May ─ Jun with ↑ / ↓ trend indicators */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${observations.length}, 1fr)`,
        gap: '0.35rem',
        background: '#F8FAFC',
        padding: '0.6rem 0.5rem',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        textAlign: 'center'
      }}>
        {observations.map((obs, idx) => {
          const prev = idx > 0 ? observations[idx - 1] : undefined;
          const trend = getStatusDirection(obs, prev);
          const isSelected = activeObs?.date === obs.date;
          return (
            <div
              key={idx}
              onClick={() => setActiveObs(obs)}
              style={{
                cursor: 'pointer',
                background: isSelected ? '#DCFCE7' : 'transparent',
                borderRadius: '8px',
                padding: '4px 2px',
                border: isSelected ? '1px solid #86EFAC' : '1px solid transparent'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>
                {formatMonth(obs.date)}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: trend.color, margin: '1px 0' }}>
                {trend.icon}
              </div>
              <div style={{ fontSize: '0.64rem', color: '#334155', fontWeight: 700 }}>
                {trend.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapsible Detailed Curve Chart */}
      {showTechnicalNdvi && (
        <div style={{ marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginBottom: '0.4rem', fontWeight: 600 }}>
            <span>Selected date: <strong>{activeObs?.date}</strong></span>
            <span>Index value: <strong style={{ color: '#15803D' }}>{activeObs?.ndvi}</strong></span>
          </div>

          <div style={{ width: '100%', height: '80px', background: '#F8FAFC', borderRadius: '8px', padding: '4px', boxSizing: 'border-box' }}>
            <svg viewBox="0 0 300 70" style={{ width: '100%', height: '100%' }}>
              <path
                d={observations.map((obs, i) => {
                  const x = (i / (observations.length - 1 || 1)) * 260 + 20;
                  const y = 60 - (obs.ndvi * 50);
                  return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                }).join(' ')}
                fill="none"
                stroke="#16A34A"
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
                    r={activeObs?.date === obs.date ? 5 : 3}
                    fill={activeObs?.date === obs.date ? '#15803D' : '#22C55E'}
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
  );
};
