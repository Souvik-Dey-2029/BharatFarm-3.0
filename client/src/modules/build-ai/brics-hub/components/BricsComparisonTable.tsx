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
      <div style={{ padding: '3rem', color: '#64748B', textAlign: 'center', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        No comparison records match the selected filters.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {groups.map((group) => (
        <div
          key={group.topic}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '1.5rem',
            overflowX: 'auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#15803D',
            fontSize: '1.1rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚖️ Comparative Domain: {group.topicLabel}</span>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
              ({group.records.length} BRICS practices)
            </span>
          </h3>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: '#0F172A',
            fontSize: '0.85rem',
            textAlign: 'left'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#475569', background: '#F8FAFC' }}>
                <th style={{ padding: '0.75rem', width: '15%' }}>Country</th>
                <th style={{ padding: '0.75rem', width: '15%' }}>Crop</th>
                <th style={{ padding: '0.75rem', width: '32%' }}>Regenerative Practice</th>
                <th style={{ padding: '0.75rem', width: '23%' }}>Measured Impact</th>
                <th style={{ padding: '0.75rem', width: '15%' }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {group.records.map((r) => (
                <tr
                  key={r.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    transition: 'background 0.2s'
                  }}
                >
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#0F172A' }}>
                    {COUNTRY_FLAGS[r.country]} {r.countryName}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', color: '#0284C7', fontWeight: 600 }}>
                    {r.crop}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem' }}>
                    <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.2rem' }}>
                      {r.practice}
                    </strong>
                    <span style={{ color: '#475569', fontSize: '0.8rem', lineHeight: 1.4 }}>{r.summary}</span>
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', color: '#B45309', fontWeight: 600 }}>
                    {r.impactMetric}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', color: '#64748B', fontSize: '0.75rem' }}>
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
