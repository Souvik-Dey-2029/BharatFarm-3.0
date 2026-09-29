import React from 'react';
import { BricsComparisonGroup } from '../types.js';

interface Props {
  groups: BricsComparisonGroup[];
}

const COUNTRY_FLAGS: Record<string, string> = {
  IN: '🇮🇳',
  BR: '🇧🇷',
  RU: '🇷🇺',
  CN: '🇨🇳',
  ZA: '🇿🇦'
};

export const BricsComparisonTable: React.FC<Props> = ({ groups }) => {
  if (!groups || groups.length === 0) {
    return (
      <div style={{ padding: '2rem', color: '#9ca3af', textAlign: 'center' }}>
        No comparison records match the selected filters.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {groups.map((group) => (
        <div
          key={group.topic}
          style={{
            background: 'rgba(17, 24, 39, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.25rem',
            overflowX: 'auto'
          }}
        >
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#34d399',
            fontSize: '1.1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ⚖️ Comparative Topic: {group.topicLabel}
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 400 }}>
              ({group.records.length} BRICS practices)
            </span>
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
                <th style={{ padding: '0.75rem', width: '15%' }}>Country</th>
                <th style={{ padding: '0.75rem', width: '15%' }}>Crop</th>
                <th style={{ padding: '0.75rem', width: '30%' }}>Regenerative Practice</th>
                <th style={{ padding: '0.75rem', width: '25%' }}>Measured Impact</th>
                <th style={{ padding: '0.75rem', width: '15%' }}>Source Institution</th>
              </tr>
            </thead>
            <tbody>
              {group.records.map((r) => (
                <tr
                  key={r.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'background 0.2s'
                  }}
                >
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                    {COUNTRY_FLAGS[r.country]} {r.countryName}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#60a5fa' }}>
                    {r.crop}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.2rem' }}>
                      {r.practice}
                    </strong>
                    <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{r.summary}</span>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#fbbf24', fontWeight: 500 }}>
                    {r.impactMetric}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#9ca3af', fontSize: '0.75rem' }}>
                    {r.source} ({r.sourceDate})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};
