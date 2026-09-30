import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SoilRecommendation } from '../types.js';
import { useLanguage } from '../../../../context/LanguageContext.js';

interface SoilRecommendationsCardProps {
  recommendations: SoilRecommendation[];
  warnings: string[];
  source: 'live_ai' | 'deterministic';
}

export const SoilRecommendationsCard: React.FC<SoilRecommendationsCardProps> = ({
  recommendations,
  warnings,
  source
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showAllRecs, setShowAllRecs] = useState<boolean>(false);

  const topRec = recommendations && recommendations.length > 0 ? recommendations[0] : null;
  const remainingRecs = recommendations && recommendations.length > 1 ? recommendations.slice(1) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
      {/* Warnings & Risk Flags */}
      {warnings && warnings.length > 0 && (
        <div style={{
          background: '#FEF2F2',
          borderRadius: '12px',
          padding: '0.75rem 0.85rem',
          border: '1px solid #FECACA'
        }}>
          <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.86rem', color: '#991B1B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>warning</span>
            <span>Soil Deficiency Flags</span>
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {warnings.map((w, idx) => (
              <div key={idx} style={{ fontSize: '0.78rem', color: '#7F1D1D', display: 'flex', gap: '0.35rem' }}>
                <span>•</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Recommendations Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '0.85rem 1rem',
        border: '1.5px solid #BBF7D0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.4rem' }}>
          <h3 style={{ margin: 0, fontSize: '0.96rem', color: '#0F172A', fontWeight: 800 }}>
            {t('buildAi.topRecommendation')}
          </h3>

          <span style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '6px',
            background: source === 'live_ai' ? '#DCFCE7' : '#E0F2FE',
            color: source === 'live_ai' ? '#15803D' : '#0369A1'
          }}>
            {source === 'live_ai' ? t('buildAi.liveDataBadge') : 'MEASURED DATA'}
          </span>
        </div>

        {/* Top Recommendation Highlight */}
        {topRec && (
          <div style={{
            background: '#F0FDF4',
            padding: '0.75rem 0.85rem',
            borderRadius: '10px',
            border: '1px solid #BBF7D0',
            marginBottom: '0.65rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#15803D' }}>
                🌱 {topRec.title}
              </span>
              <span style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '4px',
                background: '#DCFCE7',
                color: '#15803D'
              }}>
                {t('buildAi.urgent')}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
              {topRec.description}
            </p>
          </div>
        )}

        {/* Collapsible Secondary Recommendations */}
        {remainingRecs.length > 0 && (
          <div style={{ marginBottom: '0.75rem' }}>
            <button
              onClick={() => setShowAllRecs(!showAllRecs)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#15803D',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                padding: '0.25rem 0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <span>{showAllRecs ? 'Hide additional recommendations' : `+ View ${remainingRecs.length} more recommendation(s)`}</span>
              <span>{showAllRecs ? '▲' : '▼'}</span>
            </button>

            {showAllRecs && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                {remainingRecs.map((rec, idx) => (
                  <div key={idx} style={{
                    background: '#F8FAFC',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0'
                  }}>
                    <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0F172A', marginBottom: '2px' }}>
                      {rec.title}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.35 }}>
                      {rec.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2-Column Cross-Feature CTA Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5rem',
          borderTop: '1px solid #F1F5F9',
          paddingTop: '0.65rem'
        }}>
          <button
            onClick={() => navigate('/build-ai/regenerative-ai')}
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
            <span>{t('buildAi.getAiAdviceAction')}</span>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>psychology</span>
          </button>

          <button
            onClick={() => navigate('/build-ai/satellite')}
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
            <span>{t('buildAi.cropHealth')}</span>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>satellite_alt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
