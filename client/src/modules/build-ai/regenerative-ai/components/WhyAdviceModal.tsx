import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext.js';

interface WhyAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherInfo?: string;
  soilInfo?: string;
  satelliteInfo?: string;
}

export const WhyAdviceModal: React.FC<WhyAdviceModalProps> = ({
  isOpen,
  onClose,
  weatherInfo = 'Partly cloudy · 20% rain',
  soilInfo = 'pH 6.5 · Organic Carbon 0.62%',
  satelliteInfo = 'NDVI 0.62 · Moderate'
}) => {
  const { t } = useLanguage();

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
        maxWidth: '360px',
        width: '100%',
        padding: '1.25rem',
        animation: 'fadeIn 0.18s ease-out'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          borderBottom: '1px solid #EFEAE2',
          paddingBottom: '0.65rem'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.05rem',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1rem' }}>
          {/* Weather Signal */}
          <div style={{
            background: '#FDFBF7',
            border: '1px solid #EFEAE2',
            borderRadius: '10px',
            padding: '0.65rem 0.8rem'
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#D97706', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>🌤</span>
              <span>{t('buildAi.regenerative.whyModalSignalWeather')}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#0F172A', fontWeight: 600 }}>
              {weatherInfo}
            </div>
          </div>

          {/* Soil Signal */}
          <div style={{
            background: '#FDFBF7',
            border: '1px solid #EFEAE2',
            borderRadius: '10px',
            padding: '0.65rem 0.8rem'
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#B45309', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>🧪</span>
              <span>{t('buildAi.regenerative.whyModalSignalSoil')}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#0F172A', fontWeight: 600 }}>
              {soilInfo}
            </div>
          </div>

          {/* Satellite Signal */}
          <div style={{
            background: '#FDFBF7',
            border: '1px solid #EFEAE2',
            borderRadius: '10px',
            padding: '0.65rem 0.8rem'
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#15803D', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>🛰</span>
              <span>{t('buildAi.regenerative.whyModalSignalSatellite')}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#0F172A', fontWeight: 600 }}>
              {satelliteInfo}
            </div>
          </div>
        </div>

        {/* Explanatory Notice */}
        <p style={{
          fontSize: '0.74rem',
          color: '#64748B',
          textAlign: 'center',
          lineHeight: 1.4,
          margin: '0 0 1.1rem 0',
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
            padding: '0.6rem 1rem',
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
