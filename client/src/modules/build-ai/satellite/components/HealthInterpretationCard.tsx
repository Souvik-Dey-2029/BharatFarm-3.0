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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Farmer Advice Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '0.85rem 1rem',
        border: '1.5px solid #BBF7D0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        {/* Header with Title and Action Priority */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '8px',
            background: '#DCFCE7',
            color: '#15803D'
          }}>
            🌱 {t('buildAi.whatShouldIDo')}
          </span>

          <span style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: interpretation.actionPriority === 'HIGH' || interpretation.actionPriority === 'URGENT' ? '#B91C1C' : '#15803D',
            background: interpretation.actionPriority === 'HIGH' || interpretation.actionPriority === 'URGENT' ? '#FEE2E2' : '#DCFCE7',
            padding: '2px 7px',
            borderRadius: '6px'
          }}>
            {interpretation.actionPriority === 'HIGH' || interpretation.actionPriority === 'URGENT'
              ? t('buildAi.urgent')
              : t('buildAi.good')}
          </span>
        </div>

        {/* Short farmer-friendly statement */}
        <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem', lineHeight: 1.3 }}>
          {interpretation.headline}
        </div>

        <p style={{ margin: '0 0 0.65rem 0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
          {interpretation.summary}
        </p>

        {/* 2-Column Mini Indicators (Water Status & Nitrogen Status) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          <div style={{ background: '#F0F9FF', padding: '0.55rem 0.65rem', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
            <div style={{ fontSize: '0.68rem', color: '#0369A1', fontWeight: 700 }}>💧 Water Status</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284C7', marginTop: '2px' }}>{interpretation.waterStatus}</div>
          </div>
          <div style={{ background: '#F0FDF4', padding: '0.55rem 0.65rem', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '0.68rem', color: '#15803D', fontWeight: 700 }}>🌱 Nitrogen Status</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>{interpretation.nitrogenLevel}</div>
          </div>
        </div>

        {/* Key Farmer Checkpoints */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
          {interpretation.recommendations.map((rec, idx) => (
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
              <span>{rec}</span>
            </div>
          ))}
        </div>

        {/* 2-Column Next Step Buttons */}
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

      {/* Collapsible Technical Details for Satellite Sensor */}
      <div style={{
        background: '#F8FAFC',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '0.65rem 0.85rem'
      }}>
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748B',
            fontWeight: 800,
            fontSize: '0.74rem',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
            <span>{t('buildAi.whyQuestion')} ({t('buildAi.moreDetails')})</span>
          </span>
          <span>{showTechnicalDetails ? '▲' : '▼'}</span>
        </button>

        {showTechnicalDetails && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.4rem',
            marginTop: '0.55rem',
            paddingTop: '0.55rem',
            borderTop: '1px solid #E2E8F0',
            fontSize: '0.72rem',
            color: '#64748B'
          }}>
            <div><strong style={{ color: '#0F172A' }}>Sensor:</strong> {modelMetadata.satellite}</div>
            <div><strong style={{ color: '#0F172A' }}>Res:</strong> {modelMetadata.resolution}</div>
            <div><strong style={{ color: '#0F172A' }}>Provider:</strong> {modelMetadata.provider}</div>
            <div><strong style={{ color: '#0F172A' }}>Freq:</strong> {modelMetadata.updateFrequency}</div>
          </div>
        )}
      </div>
    </div>
  );
};
