import React, { useState } from 'react';
import { SatelliteObservation } from '../satellite.types.js';

interface NdviTimeSeriesChartProps {
  observations: SatelliteObservation[];
}

export const NdviTimeSeriesChart: React.FC<NdviTimeSeriesChartProps> = ({ observations }) => {
  const [activeObs, setActiveObs] = useState<SatelliteObservation | null>(
    observations && observations.length > 0 ? observations[observations.length - 1] : null
  );

  if (!observations || observations.length === 0) {
    return null;
  }

  const chartHeight = 150;
  const chartWidth = 340;

  const minNdvi = 0.0;
  const maxNdvi = 1.0;

  const points = observations.map((obs, idx) => {
    const x = (idx / (observations.length - 1 || 1)) * (chartWidth - 50) + 25;
    const y = chartHeight - ((obs.ndvi - minNdvi) / (maxNdvi - minNdvi)) * (chartHeight - 40) - 20;
    return { x, y, obs };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${chartHeight - 20} L ${points[0].x.toFixed(1)} ${chartHeight - 20} Z`;

  const getHealthBadge = (health: string) => {
    if (health === 'EXCELLENT' || health === 'HEALTHY') return { bg: '#DCFCE7', text: '#15803D' };
    if (health === 'MODERATE') return { bg: '#FEF3C7', text: '#B45309' };
    return { bg: '#FEE2E2', text: '#B91C1C' };
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '1.25rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F172A', fontWeight: 800 }}>
            Vegetation Health Trend (NDVI)
          </h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
            Bi-weekly Sentinel-2 observation timeline
          </p>
        </div>

        {activeObs && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#15803D' }}>
                {activeObs.ndvi}
              </span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '6px',
                ...getHealthBadge(activeObs.vegetationHealth)
              }}>
                {activeObs.vegetationHealth}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
              {activeObs.date}
            </div>
          </div>
        )}
      </div>

      {/* SVG Time Series Line Chart */}
      <div style={{ width: '100%', overflowX: 'auto', background: '#F8FAFC', borderRadius: '12px', padding: '0.5rem 0.25rem', border: '1px solid #F1F5F9' }}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          {/* Reference Threshold Lines */}
          <line x1="25" y1={chartHeight - (0.75 * (chartHeight - 40) + 20)} x2={chartWidth - 25} y2={chartHeight - (0.75 * (chartHeight - 40) + 20)} stroke="#86EFAC" strokeDasharray="3 3" />
          <text x={chartWidth - 24} y={chartHeight - (0.75 * (chartHeight - 40) + 16)} fill="#16A34A" fontSize="8" fontWeight="bold">0.75 (Healthy)</text>

          <line x1="25" y1={chartHeight - (0.45 * (chartHeight - 40) + 20)} x2={chartWidth - 25} y2={chartHeight - (0.45 * (chartHeight - 40) + 20)} stroke="#FCD34D" strokeDasharray="3 3" />
          <text x={chartWidth - 24} y={chartHeight - (0.45 * (chartHeight - 40) + 16)} fill="#D97706" fontSize="8" fontWeight="bold">0.45 (Moderate)</text>

          {/* Area Fill */}
          <path d={areaD} fill="url(#ndviGradient)" opacity="0.45" />

          {/* Line Path */}
          <path d={pathD} fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#DCFCE7" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Interactive Data Points */}
          {points.map((p, idx) => (
            <g key={idx} onClick={() => setActiveObs(p.obs)} style={{ cursor: 'pointer' }}>
              <circle
                cx={p.x}
                cy={p.y}
                r={activeObs?.date === p.obs.date ? 6 : 4}
                fill={activeObs?.date === p.obs.date ? '#15803D' : '#22C55E'}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginTop: '0.5rem', fontWeight: 600 }}>
        <span>{observations[0]?.date}</span>
        <span>Tap point to inspect observation date</span>
        <span>{observations[observations.length - 1]?.date}</span>
      </div>
    </div>
  );
};
