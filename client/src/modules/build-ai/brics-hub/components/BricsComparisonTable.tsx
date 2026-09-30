import React from 'react';
import { BricsComparisonGroup } from '../types.js';
import { useLanguage } from '../../../../context/LanguageContext.js';

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
  const { t } = useLanguage();

  if (!groups || groups.length === 0) {
    return (
      <div style={{ padding: '2rem 1rem', color: '#64748B', textAlign: 'center', background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #EFEAE2' }}>
        {t('buildAi.brics.noMatchesTitle')}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {groups.map((group) => (
        <div
          key={group.topic}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #EFEAE2',
            borderRadius: '14px',
            padding: '1.1rem',
            overflowX: 'auto',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <h3 style={{
            margin: '0 0 0.85rem 0',
            color: '#15803D',
            fontSize: '0.96rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap'
          }}>
            <span>⚖️ {t('buildAi.brics.comparativeDomain')} {group.topicLabel}</span>
            <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
              ({t('buildAi.brics.practicesCount').replace('{count}', group.records.length.toString())})
            </span>
          </h3>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: '#0F172A',
            fontSize: '0.82rem',
            textAlign: 'left'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EFEAE2', color: '#475569', background: '#FDFBF7' }}>
                <th style={{ padding: '0.65rem', width: '15%' }}>{t('buildAi.brics.thCountry')}</th>
                <th style={{ padding: '0.65rem', width: '15%' }}>{t('buildAi.brics.thCrop')}</th>
                <th style={{ padding: '0.65rem', width: '32%' }}>{t('buildAi.brics.thPractice')}</th>
                <th style={{ padding: '0.65rem', width: '23%' }}>{t('buildAi.brics.thImpact')}</th>
                <th style={{ padding: '0.65rem', width: '15%' }}>{t('buildAi.brics.thSource')}</th>
              </tr>
            </thead>
            <tbody>
              {group.records.map((r) => (
                <tr
                  key={r.id}
                  style={{
                    borderBottom: '1px solid #FDFBF7',
                    transition: 'background 0.2s'
                  }}
                >
                  <td style={{ padding: '0.75rem 0.65rem', fontWeight: 700, color: '#0F172A' }}>
                    {COUNTRY_FLAGS[r.country]} {r.countryName}
                  </td>
                  <td style={{ padding: '0.75rem 0.65rem', color: '#92400E', fontWeight: 600 }}>
                    {r.crop}
                  </td>
                  <td style={{ padding: '0.75rem 0.65rem' }}>
                    <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.2rem' }}>
                      {r.practice}
                    </strong>
                    <span style={{ color: '#475569', fontSize: '0.76rem', lineHeight: 1.4 }}>{r.summary}</span>
                  </td>
                  <td style={{ padding: '0.75rem 0.65rem', color: '#B45309', fontWeight: 600 }}>
                    {r.impactMetric}
                  </td>
                  <td style={{ padding: '0.75rem 0.65rem', color: '#64748B', fontSize: '0.72rem' }}>
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
