import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BricsKnowledgeRecord } from '../types.js';
import { useLanguage } from '../../../../context/LanguageContext.js';
import { tokens } from '../../theme.js';

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
  const navigate = useNavigate();
  const { t } = useLanguage();
  const flag = COUNTRY_FLAGS[record.country] || '🌍';
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <div style={{
      background: tokens.colors.surfaceLight,
      border: `1.5px solid ${tokens.colors.borderDefault}`,
      borderRadius: tokens.radii.md,
      padding: '0.85rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: tokens.shadows.subtle
    }}>
      <div>
        {/* Top: Country & Crop */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', gap: '0.4rem' }}>
          <span style={{
            background: tokens.colors.primaryBg,
            border: `1px solid ${tokens.colors.statusGoodBorder}`,
            color: tokens.colors.primaryLeaf,
            padding: '2px 8px',
            borderRadius: tokens.radii.xs,
            fontSize: tokens.typography.micro,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <span>{flag}</span> {record.countryName}
          </span>

          <span style={{
            background: tokens.colors.surfaceAlt,
            border: `1px solid ${tokens.colors.borderDefault}`,
            color: tokens.colors.earth,
            padding: '2px 8px',
            borderRadius: tokens.radii.xs,
            fontSize: tokens.typography.micro,
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>grass</span>
            <span>{record.crop}</span>
          </span>
        </div>

        {/* Practice Title */}
        <h4 style={{
          margin: '0 0 0.35rem 0',
          color: tokens.colors.textPrimary,
          fontSize: '0.96rem',
          fontWeight: 800,
          lineHeight: '1.3'
        }}>
          {record.practice}
        </h4>

        {/* Concise Summary */}
        <p style={{
          margin: '0 0 0.6rem 0',
          color: tokens.colors.textSecondary,
          fontSize: tokens.typography.small,
          lineHeight: '1.4'
        }}>
          {record.summary}
        </p>

        {/* Indicators: Impact & Topic */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.4rem',
          marginBottom: '0.65rem'
        }}>
          <div style={{
            background: tokens.colors.statusWatchBg,
            padding: '0.35rem 0.5rem',
            borderRadius: tokens.radii.xs,
            border: `1px solid ${tokens.colors.statusWatchBorder}`,
            fontSize: tokens.typography.micro,
            color: tokens.colors.statusWatch,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>bolt</span>
            <span>{record.impactMetric}</span>
          </div>

          <div style={{
            background: tokens.colors.primaryBg,
            padding: '0.35rem 0.5rem',
            borderRadius: tokens.radii.xs,
            border: `1px solid ${tokens.colors.statusGoodBorder}`,
            fontSize: tokens.typography.micro,
            color: tokens.colors.primaryLeaf,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>eco</span>
            <span>{record.topicLabel}</span>
          </div>
        </div>
      </div>

      {/* Footer with [ Use in my field → ] & [ Details ] */}
      <div style={{ borderTop: `1px solid ${tokens.colors.borderDefault}`, paddingTop: '0.55rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
          <button
            onClick={() => navigate('/build-ai/regenerative-ai')}
            style={{
              background: tokens.colors.primaryLeaf,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: tokens.radii.xs,
              padding: '3px 8px',
              fontSize: tokens.typography.micro,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 1px 3px rgba(47, 125, 70, 0.25)'
            }}
          >
            <span>{t('buildAi.brics.useInField')}</span>
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_forward</span>
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: 'transparent',
              color: tokens.colors.textMuted,
              border: 'none',
              padding: '2px 4px',
              fontSize: tokens.typography.micro,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <span>{showDetails ? t('buildAi.brics.hideDetailsBtn') : t('buildAi.brics.seeHowBtn')}</span>
          </button>
        </div>

        {/* Detailed technical information tucked behind Details */}
        {showDetails && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem 0.65rem',
            background: tokens.colors.surfaceAlt,
            borderRadius: tokens.radii.xs,
            border: `1px solid ${tokens.colors.borderDefault}`,
            fontSize: tokens.typography.micro,
            color: tokens.colors.textSecondary,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem'
          }}>
            <div><strong>{t('buildAi.brics.researchSource')}</strong> {record.source}</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
              {record.tags.map((tag, idx) => (
                <span key={idx} style={{ background: '#E2E8F0', color: tokens.colors.textPrimary, padding: '1px 5px', borderRadius: '3px', fontSize: '10px' }}>
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
