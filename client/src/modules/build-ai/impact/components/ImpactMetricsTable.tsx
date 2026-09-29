import React from 'react';
import { ImpactMetricRecord } from '../types.js';

interface Props {
  metrics: ImpactMetricRecord[];
}

const SOURCE_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  measured: { label: '🔬 Measured', color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)' },
  'user-entered': { label: '✍️ User-Entered', color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.15)' },
  'api-derived': { label: '📡 API-Derived', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
  'model-estimated': { label: '🤖 Model-Estimated', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.15)' },
  demo: { label: '⚙️ Demo Dataset', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.15)' }
};

export const ImpactMetricsTable: React.FC<Props> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) {
    return (
      <div style={{
        background: 'rgba(17, 24, 39, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        color: '#9ca3af'
      }}>
        No verified impact evaluation records found for this field.
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(17, 24, 39, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '1.25rem',
      overflowX: 'auto'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#ffffff', fontSize: '1rem', fontWeight: 600 }}>
        📋 Provenance-Tracked Metric Records
      </h3>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        color: '#e5e7eb',
        fontSize: '0.85rem',
        textAlign: 'left'
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', color: '#9ca3af' }}>
            <th style={{ padding: '0.75rem' }}>Metric & Category</th>
            <th style={{ padding: '0.75rem' }}>Current Value</th>
            <th style={{ padding: '0.75rem' }}>Trajectory Change</th>
            <th style={{ padding: '0.75rem' }}>Data Provenance</th>
            <th style={{ padding: '0.75rem' }}>Measured Date</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((item) => {
            const badge = SOURCE_BADGES[item.sourceType] || SOURCE_BADGES.demo;

            return (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{item.metricName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{item.notes || item.category}</div>
                </td>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#34d399' }}>
                  {item.value} <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>{item.unit}</span>
                </td>
                <td style={{ padding: '0.75rem', fontWeight: 600, color: item.changePercentage >= 0 ? '#34d399' : '#f87171' }}>
                  {item.changePercentage >= 0 ? `+${item.changePercentage}%` : `${item.changePercentage}%`}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    background: badge.bg,
                    color: badge.color,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    display: 'inline-block',
                    marginBottom: '0.2rem'
                  }}>
                    {badge.label}
                  </span>
                  <div style={{ fontSize: '0.725rem', color: '#9ca3af' }}>{item.sourceLabel}</div>
                </td>
                <td style={{ padding: '0.75rem', color: '#9ca3af', fontSize: '0.75rem' }}>
                  📅 {item.measuredAt}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
