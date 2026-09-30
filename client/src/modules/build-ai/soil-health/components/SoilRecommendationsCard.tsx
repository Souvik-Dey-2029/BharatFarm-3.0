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
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  // Top 2-3 priorities for what your soil needs
  const topPriorities = recommendations.slice(0, 3);

  const getPriorityIcon = (type: string, idx: number) => {
    if (type === 'ORGANIC_MATTER' || idx === 0) return '🌾';
    if (type === 'NUTRIENT_CORRECTION' || idx === 1) return '🧪';
    return '🌱';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1rem' }}>
      {/* 🌱 WHAT YOUR SOIL NEEDS (Top 2-3 priorities) */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '0.85rem 1rem',
        border: '1.5px solid #EFEAE2',
        boxShadow: '0 1px 3px rgba(180, 83, 9, 0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.94rem', color: '#0F172A', fontWeight: 800 }}>
              {t('buildAi.soil.whatSoilNeedsTitle')}
            </h3>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B' }}>
              {t('buildAi.soil.whatSoilNeedsSub')}
            </p>
          </div>

          <span style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '2px 7px',
            borderRadius: '6px',
            background: '#DCFCE7',
            color: '#15803D'
          }}>
            {t('buildAi.soil.prioritiesCount')}
          </span>
        </div>

        {/* Priority 1, 2, 3 with icon, status, one-line explanation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.75rem' }}>
          {topPriorities.map((rec, idx) => (
            <div key={idx} style={{
              background: '#FDFBF7',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #EFEAE2'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#15803D' }}>
                  {getPriorityIcon(rec.type, idx)} {idx + 1}. {rec.title}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: '#DCFCE7',
                  color: '#15803D'
                }}>
                  {t('buildAi.soil.recommendedBadge')}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#334155', lineHeight: 1.35 }}>
                {rec.description}
              </p>
            </div>
          ))}
        </div>

        {/* 2-Column Direct CTAs */}
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

      {/* Warnings & Risk Flags behind Details */}
      {warnings && warnings.length > 0 && (
        <div style={{
          background: '#FEF2F2',
          borderRadius: '10px',
          padding: '0.6rem 0.75rem',
          border: '1px solid #FECACA'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#991B1B', fontWeight: 800, marginBottom: '2px' }}>
            ⚠️ {t('buildAi.soil.deficiencyNotice')}
          </div>
          {warnings.map((w, idx) => (
            <div key={idx} style={{ fontSize: '0.74rem', color: '#7F1D1D' }}>
              • {w}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
