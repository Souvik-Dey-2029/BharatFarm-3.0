import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../context/LanguageContext.js';

interface WhyAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  cropName?: string;
  weatherInfo?: string;
  soilInfo?: string;
  satelliteInfo?: string;
}

export const WhyAdviceModal: React.FC<WhyAdviceModalProps> = ({
  isOpen,
  onClose,
  cropName = 'Rice (Paddy)',
  weatherInfo = '28°C · 20% rain · Partly cloudy',
  soilInfo = 'pH 6.5 · Organic Carbon 0.62%',
  satelliteInfo = 'NDVI 0.62 · Moderate'
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1.5px solid #EFEAE2',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        maxWidth: '380px',
        width: '100%',
        padding: '1.25rem',
        animation: 'fadeIn 0.18s ease-out',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.85rem',
          borderBottom: '1.5px solid #EFEAE2',
          paddingBottom: '0.65rem'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.02rem',
            fontWeight: 800,
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <span className="material-symbols-outlined" style={{ color: '#16A34A', fontSize: '22px' }}>psychology_alt</span>
            <span>{t('buildAi.regenerative.whyModalTitle')}</span>
          </h3>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              display: 'flex',
              padding: '2px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>

        {/* Signals List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '0.85rem' }}>
          {/* Satellite Signal */}
          <div style={{
            background: '#FDFBF7',
            border: '1px solid #EFEAE2',
            borderRadius: '10px',
            padding: '0.55rem 0.75rem'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#15803D', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>satellite_alt</span>
              <span>{t('buildAi.regenerative.whyModalSignalSatellite')}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#0F172A', fontWeight: 600 }}>
              {satelliteInfo}
            </div>
          </div>

          {/* Soil Signal */}
          <div style={{
            background: '#FDFBF7',
            border: '1px solid #EFEAE2',
            borderRadius: '10px',
            padding: '0.55rem 0.75rem'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#B45309', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>science</span>
              <span>{t('buildAi.regenerative.whyModalSignalSoil')}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#0F172A', fontWeight: 600 }}>
              {soilInfo}
            </div>
          </div>

          {/* Weather Signal */}
          <div style={{
            background: '#FDFBF7',
            border: '1px solid #EFEAE2',
            borderRadius: '10px',
            padding: '0.55rem 0.75rem'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D97706', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>wb_sunny</span>
              <span>{t('buildAi.regenerative.whyModalSignalWeather')}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#0F172A', fontWeight: 600 }}>
              {weatherInfo}
            </div>
          </div>

          {/* Crop Signal */}
          <div style={{
            background: '#FDFBF7',
            border: '1px solid #EFEAE2',
            borderRadius: '10px',
            padding: '0.55rem 0.75rem'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284C7', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>grass</span>
              <span>{t('buildAi.regenerative.whyModalSignalCrop')}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#0F172A', fontWeight: 600 }}>
              {cropName}
            </div>
          </div>
        </div>

        {/* BRICS Knowledge Used Box */}
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '10px',
          padding: '0.65rem 0.75rem',
          marginBottom: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '3px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#15803D' }}>public</span>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#15803D' }}>
              {t('buildAi.regenerative.whyModalKnowledgeUsed')}
            </span>
          </div>
          <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.74rem', color: '#334155', lineHeight: 1.35 }}>
            {t('buildAi.regenerative.whyModalBricsNotice')}
          </p>
          <button
            onClick={() => {
              onClose();
              navigate('/build-ai/brics-hub');
            }}
            style={{
              background: '#FFFFFF',
              border: '1px solid #86EFAC',
              color: '#15803D',
              borderRadius: '6px',
              padding: '2px 7px',
              fontSize: '0.7rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <span>{t('buildAi.regenerative.explorePracticesBtn')}</span>
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_forward</span>
          </button>
        </div>

        {/* Explanatory Notice */}
        <p style={{
          fontSize: '0.72rem',
          color: '#64748B',
          textAlign: 'center',
          lineHeight: 1.4,
          margin: '0 0 0.85rem 0',
          fontWeight: 500
        }}>
          {t('buildAi.regenerative.whyModalSignalsNotice')}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: '#15803D',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '0.55rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(21, 128, 61, 0.2)'
          }}
        >
          {t('buildAi.regenerative.whyModalCloseBtn')}
        </button>
      </div>
    </div>
  );
};
