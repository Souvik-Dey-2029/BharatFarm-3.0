import React, { useState } from 'react';
import { BricsKnowledgeRecord } from '../types.js';
import { useLanguage } from '../../../../context/LanguageContext.js';

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
  const { t } = useLanguage();
  const flag = COUNTRY_FLAGS[record.country] || '🌍';
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1.5px solid #EFEAE2',
      borderRadius: '14px',
      padding: '0.85rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
    }}>
      <div>
        {/* Top: Country & Crop */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', gap: '0.4rem' }}>
          <span style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            color: '#15803D',
            padding: '2px 7px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <span>{flag}</span> {record.countryName}
          </span>

          <span style={{
            background: '#FDFBF7',
            border: '1px solid #EFEAE2',
            color: '#92400E',
            padding: '2px 7px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 800
          }}>
            🌾 {record.crop}
          </span>
        </div>

        {/* Practice Title */}
        <h4 style={{
          margin: '0 0 0.35rem 0',
          color: '#0F172A',
          fontSize: '0.96rem',
          fontWeight: 800,
          lineHeight: '1.3'
        }}>
          {record.practice}
        </h4>

        {/* What farmers do (One short sentence) */}
        <p style={{
          margin: '0 0 0.55rem 0',
          color: '#475569',
          fontSize: '0.78rem',
          lineHeight: '1.4'
        }}>
          {record.summary}
        </p>

        {/* Why it helps: 2-3 visual indicators */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.4rem',
          marginBottom: '0.65rem'
        }}>
          <div style={{ background: '#FFFBEB', padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #FEF3C7', fontSize: '0.7rem', color: '#92400E', fontWeight: 700 }}>
            ⚡ {record.impactMetric}
          </div>
          <div style={{ background: '#F0FDF4', padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #BBF7D0', fontSize: '0.7rem', color: '#15803D', fontWeight: 700 }}>
            🌱 {record.topicLabel}
          </div>
        </div>
      </div>

      {/* Footer with [ See how → ] & Collapsible Details */}
      <div style={{ borderTop: '1px solid #EFEAE2', paddingTop: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: '#FDFBF7',
              color: '#15803D',
              border: '1px solid #EFEAE2',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <span>{showDetails ? t('buildAi.brics.hideDetailsBtn') : t('buildAi.brics.seeHowBtn')}</span>
          </button>

          <span style={{ fontSize: '0.68rem', color: '#64748B' }}>
            📅 {record.sourceDate}
          </span>
        </div>

        {/* Detailed technical information tucked behind Details */}
        {showDetails && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem 0.65rem',
            background: '#FDFBF7',
            borderRadius: '6px',
            border: '1px solid #EFEAE2',
            fontSize: '0.7rem',
            color: '#475569',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem'
          }}>
            <div><strong>{t('buildAi.brics.researchSource')}</strong> {record.source}</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
              {record.tags.map((tag, idx) => (
                <span key={idx} style={{ background: '#E2E8F0', color: '#334155', padding: '1px 5px', borderRadius: '3px', fontSize: '0.66rem' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
