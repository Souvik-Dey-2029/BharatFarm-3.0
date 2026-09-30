import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../context/LanguageContext.js';

interface HealthInterpretationCardProps {
  interpretation: {
    headline: string;
    summary: string;
    recommendations: string[];
    waterStatus: string;
    nitrogenLevel: string;
    actionPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  };
  modelMetadata: {
    provider: string;
    satellite: string;
    resolution: string;
    bandCombination: string;
    cloudCoverMax: string;
    updateFrequency: string;
  };
}

export const HealthInterpretationCard: React.FC<HealthInterpretationCardProps> = ({ interpretation, modelMetadata }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  // Maximum of 2 practical actions derived from existing recommendations
  const topActions = interpretation.recommendations.slice(0, 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      {/* "What this means" Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '0.85rem 1rem',
        border: '1.5px solid #BBF7D0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ fontSize: '0.74rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.25rem' }}>
          💡 What this means
        </div>

        <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.35, marginBottom: '0.35rem' }}>
          {interpretation.headline}
        </div>

        <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.45 }}>
          {interpretation.summary}
        </p>

        {/* 2-Column Mini Indicators (Water & Nitrogen) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5rem',
          marginTop: '0.65rem',
          marginBottom: '0.75rem'
        }}>
          <div style={{ background: '#F0F9FF', padding: '0.45rem 0.6rem', borderRadius: '8px', border: '1px solid #BAE6FD' }}>
            <div style={{ fontSize: '0.68rem', color: '#0369A1', fontWeight: 700 }}>💧 Water Condition</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284C7', marginTop: '1px' }}>{interpretation.waterStatus}</div>
          </div>
          <div style={{ background: '#F0FDF4', padding: '0.45rem 0.6rem', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '0.68rem', color: '#15803D', fontWeight: 700 }}>🌱 Nitrogen Condition</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16A34A', marginTop: '1px' }}>{interpretation.nitrogenLevel}</div>
          </div>
        </div>

        {/* "What you can do" (Max 2 practical actions) */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.65rem', marginBottom: '0.65rem' }}>
          <div style={{ fontSize: '0.74rem', color: '#0F172A', fontWeight: 800, marginBottom: '0.4rem' }}>
            ✅ What you can do:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {topActions.map((act, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.78rem',
                color: '#334155',
                background: '#F8FAFC',
                padding: '0.45rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid #E2E8F0'
              }}>
                <span style={{ color: '#16A34A', fontWeight: 900, fontSize: '0.85rem' }}>✓</span>
                <span style={{ fontWeight: 600 }}>{act}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Direct CTAs to Soil Health & Regenerative AI */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5rem',
          borderTop: '1px solid #F1F5F9',
          paddingTop: '0.65rem'
        }}>
          <button
            onClick={() => navigate('/build-ai/soil-health')}
            style={{
              padding: '0.5rem 0.6rem',
              background: '#16A34A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.76rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem'
            }}
          >
            <span>{t('buildAi.checkSoilAction')}</span>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_forward</span>
          </button>

          <button
            onClick={() => navigate('/build-ai/regenerative-ai')}
            style={{
              padding: '0.5rem 0.6rem',
              background: '#F8FAFC',
              color: '#0F172A',
              border: '1.5px solid #CBD5E1',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.76rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem'
            }}
          >
            <span>{t('buildAi.getAiAdviceAction')}</span>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>psychology</span>
          </button>
        </div>
      </div>

      {/* Collapsible Technical Details / Why */}
      <div style={{
        background: '#F8FAFC',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        padding: '0.55rem 0.75rem'
      }}>
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748B',
            fontWeight: 800,
            fontSize: '0.72rem',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <span>{t('buildAi.whyQuestion')} ({t('buildAi.moreDetails')})</span>
          <span>{showTechnicalDetails ? '▲' : '▼'}</span>
        </button>

        {showTechnicalDetails && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.35rem',
            marginTop: '0.45rem',
            paddingTop: '0.45rem',
            borderTop: '1px solid #E2E8F0',
            fontSize: '0.7rem',
            color: '#64748B'
          }}>
            <div><strong>Sensor:</strong> {modelMetadata.satellite}</div>
            <div><strong>Resolution:</strong> {modelMetadata.resolution}</div>
            <div><strong>Bands:</strong> {modelMetadata.bandCombination}</div>
            <div><strong>Frequency:</strong> {modelMetadata.updateFrequency}</div>
          </div>
        )}
      </div>
    </div>
  );
};
