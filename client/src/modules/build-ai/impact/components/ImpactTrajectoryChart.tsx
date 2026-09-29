import React from 'react';
import { ImpactSummaryData } from '../types.js';

interface Props {
  data: ImpactSummaryData['timeSeries'];
}

export const ImpactTrajectoryChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{
        background: 'rgba(17, 24, 39, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        color: '#9ca3af'
      }}>
        Insufficient time-series data to display evaluation trends.
      </div>
    );
  }

  const maxYield = Math.max(...data.map(d => d.yieldIndex), 120);

  return (
    <div style={{
      background: 'rgba(17, 24, 39, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '1.25rem',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1rem', fontWeight: 600 }}>
            📈 Multi-Month Regenerative Outcome Trajectory
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', color: '#9ca3af', fontSize: '0.8rem' }}>
            6-month comparative progression of soil fertility score vs risk index reduction
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#34d399' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} /> Soil Score
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#60a5fa' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa' }} /> Yield Index
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#a78bfa' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a78bfa' }} /> Risk Index
          </span>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '180px',
        gap: '0.75rem',
        paddingTop: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {data.map((item, idx) => {
          const soilHeightPct = (item.soilScore / 100) * 100;
          const yieldHeightPct = (item.yieldIndex / maxYield) * 100;
          const riskHeightPct = (item.riskIndex / 100) * 100;

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '3px',
                width: '100%',
                justifyContent: 'center',
                height: '100%'
              }}>
                {/* Soil bar */}
                <div
                  title={`Soil Score: ${item.soilScore}`}
                  style={{
                    width: '30%',
                    height: `${soilHeightPct}%`,
                    background: '#34d399',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease'
                  }}
                />
                {/* Yield bar */}
                <div
                  title={`Yield Index: ${item.yieldIndex}`}
                  style={{
                    width: '30%',
                    height: `${yieldHeightPct}%`,
                    background: '#60a5fa',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease'
                  }}
                />
                {/* Risk bar */}
                <div
                  title={`Risk Index: ${item.riskIndex}`}
                  style={{
                    width: '30%',
                    height: `${riskHeightPct}%`,
                    background: '#a78bfa',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease'
                  }}
                />
              </div>

              <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
