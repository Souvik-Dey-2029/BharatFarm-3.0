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
      background: 'rgba(17, 24, 39, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '14px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      position: 'relative'
    }}>
      <div>
        {/* Header Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem' }}>
          <span style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            padding: '0.2rem 0.5rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <span>{flag}</span> {record.countryName}
          </span>

          <span style={{
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#60a5fa',
            padding: '0.2rem 0.5rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 500
          }}>
            🌾 {record.crop}
          </span>
        </div>

        {/* Practice Title */}
        <h4 style={{
          margin: '0 0 0.5rem 0',
          color: '#ffffff',
          fontSize: '1rem',
          fontWeight: 600,
          lineHeight: '1.4'
        }}>
          {record.practice}
        </h4>

        {/* Topic Label */}
        <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginBottom: '0.75rem' }}>
          🏷️ {record.topicLabel}
        </div>

        {/* Summary Description */}
        <p style={{
          margin: '0 0 1rem 0',
          color: '#d1d5db',
          fontSize: '0.85rem',
          lineHeight: '1.5'
        }}>
          {record.summary}
        </p>

        {/* Impact Metric Highlight */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          borderLeft: '3px solid #f59e0b',
          padding: '0.5rem 0.75rem',
          borderRadius: '0 6px 6px 0',
          fontSize: '0.8rem',
          color: '#fbbf24',
          fontWeight: 500,
          marginBottom: '1rem'
        }}>
          ⚡ <strong>Impact:</strong> {record.impactMetric}
        </div>
      </div>

      {/* Footer provenance details */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {/* Tags */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {record.tags.map((tag, idx) => (
            <span key={idx} style={{
              background: 'rgba(255,255,255,0.05)',
              color: '#9ca3af',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              fontSize: '0.7rem'
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
          fontSize: '0.725rem',
          color: '#6b7280'
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
