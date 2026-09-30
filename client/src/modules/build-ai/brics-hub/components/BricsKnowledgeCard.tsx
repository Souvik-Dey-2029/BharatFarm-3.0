import React from 'react';
import { BricsKnowledgeRecord } from '../types.js';

interface Props {
  record: BricsKnowledgeRecord;
}

const COUNTRY_FLAGS: Record<string, string> = {
  IN: '🇮🇳',
  BR: '🇧🇷',
  RU: '🇷🇺',
  CN: '🇨🇳',
  ZA: '🇿🇦'
};

export const BricsKnowledgeCard: React.FC<Props> = ({ record }) => {
  const flag = COUNTRY_FLAGS[record.country] || '🌍';

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
      position: 'relative'
    }}>
      <div>
        {/* Header Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            color: '#15803D',
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <span>{flag}</span> {record.countryName}
          </span>

          <span style={{
            background: '#F0F9FF',
            border: '1px solid #BAE6FD',
            color: '#0369A1',
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            🌾 {record.crop}
          </span>
        </div>

        {/* Practice Title */}
        <h4 style={{
          margin: '0 0 0.4rem 0',
          color: '#0F172A',
          fontSize: '1.05rem',
          fontWeight: 800,
          lineHeight: '1.35'
        }}>
          {record.practice}
        </h4>

        {/* Topic Label */}
        <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700, marginBottom: '0.75rem' }}>
          🏷️ {record.topicLabel}
        </div>

        {/* Summary Description */}
        <p style={{
          margin: '0 0 1rem 0',
          color: '#475569',
          fontSize: '0.85rem',
          lineHeight: '1.5'
        }}>
          {record.summary}
        </p>

        {/* Impact Metric Highlight */}
        <div style={{
          background: '#FFFBEB',
          borderLeft: '3px solid #D97706',
          borderTop: '1px solid #FEF3C7',
          borderRight: '1px solid #FEF3C7',
          borderBottom: '1px solid #FEF3C7',
          padding: '0.55rem 0.85rem',
          borderRadius: '0 8px 8px 0',
          fontSize: '0.8rem',
          color: '#92400E',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>
          ⚡ <strong>Impact:</strong> {record.impactMetric}
        </div>
      </div>

      {/* Footer provenance details */}
      <div style={{
        borderTop: '1px solid #F1F5F9',
        paddingTop: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {/* Tags */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {record.tags.map((tag, idx) => (
            <span key={idx} style={{
              background: '#F1F5F9',
              color: '#64748B',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 600
            }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Source citation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.72rem',
          color: '#64748B'
        }}>
          <span>
            🏛️ {record.source}
          </span>
          <span>
            📅 {record.sourceDate}
          </span>
        </div>
      </div>
    </div>
  );
};
