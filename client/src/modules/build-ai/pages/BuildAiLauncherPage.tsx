import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildAiShell } from '../components/BuildAiShell.js';
import { useSharedField } from '../context/SharedFieldContext.js';
import { useLanguage } from '../../../context/LanguageContext.js';

export const BuildAiLauncherPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { fields, selectedFieldId, selectedField, setSelectedFieldId, isLoadingFields } = useSharedField();

  return (
    <BuildAiShell activeRoute="/build-ai">
      {/* Product Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
        border: '1.5px solid #BBF7D0',
        borderRadius: '16px',
        padding: '0.85rem 1rem',
        marginBottom: '0.85rem',
        boxShadow: '0 2px 6px rgba(22, 163, 74, 0.05)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          background: '#DCFCE7',
          color: '#15803D',
          padding: '0.15rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.7rem',
          fontWeight: 800,
          marginBottom: '0.3rem'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>eco</span>
          <span>{t('buildAi.appSubtitle')}</span>
        </div>

        <h1 style={{
          margin: '0 0 0.2rem 0',
          fontSize: '1.15rem',
          fontWeight: 900,
          color: '#0F172A',
          letterSpacing: '-0.02em',
          lineHeight: 1.25
        }}>
          {t('buildAi.appTitle')}
        </h1>

        <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.35, fontWeight: 500 }}>
          {t('buildAi.homeTagline')}
        </p>
      </div>

      {/* Field Selector Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1.5px solid #EFEAE2',
        padding: '0.75rem 0.9rem',
        marginBottom: '0.85rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.6rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: '1 1 200px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: '#F0FDF4',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>pin_drop</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t('buildAi.fieldSelect')}
            </div>
            {isLoadingFields ? (
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{t('common.loading')}</div>
            ) : fields.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '2px' }}>
                <select
                  value={selectedFieldId}
                  onChange={(e) => setSelectedFieldId(e.target.value)}
                  style={{
                    background: '#FDFBF7',
                    color: '#0F172A',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.2rem 0.45rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    outline: 'none',
                    cursor: 'pointer',
                    maxWidth: '100%'
                  }}
                >
                  {fields.map(f => (
                    <option key={f.id} value={f.id}>
                      🌾 {f.field_name} ({f.crop_name} • {f.area_acres} ac)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{t('buildAi.noFieldFound')}</div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate('/sih/field-mapping')}
          style={{
            padding: '0.35rem 0.65rem',
            background: '#F8FAFC',
            color: '#15803D',
            border: '1.5px solid #BBF7D0',
            borderRadius: '8px',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            whiteSpace: 'nowrap'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>map</span>
          <span>{t('home.fieldMappingShort')}</span>
        </button>
      </div>

      {/* Status Snapshot Row: Crop, Soil, and Climate */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.55rem',
        marginBottom: '0.85rem'
      }}>
        {/* Crop Status Card */}
        <div
          onClick={() => navigate('/build-ai/satellite')}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #BBF7D0',
            borderRadius: '12px',
            padding: '0.65rem 0.75rem',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#15803D' }}>
              🌾 {t('buildAi.cropHealth')}
            </span>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              background: '#DCFCE7',
              color: '#15803D',
              padding: '1px 5px',
              borderRadius: '4px'
            }}>
              {t('buildAi.good')}
            </span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A' }}>
            {t('buildAi.lookingGood')}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '1px', fontWeight: 600 }}>
            {t('buildAi.ndviScore')}: 0.72
          </div>
        </div>

        {/* Soil Status Card */}
        <div
          onClick={() => navigate('/build-ai/soil-health')}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #EFEAE2',
            borderRadius: '12px',
            padding: '0.65rem 0.75rem',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#92400E' }}>
              🧪 {t('buildAi.soilHealth')}
            </span>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              background: '#FEF3C7',
              color: '#92400E',
              padding: '1px 5px',
              borderRadius: '4px'
            }}>
              {t('buildAi.moderate')}
            </span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A' }}>
            74 / 100
          </div>
          <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '1px', fontWeight: 600 }}>
            pH 6.5 • OC 0.62%
          </div>
        </div>

        {/* Climate Context Card */}
        <div
          style={{
            background: '#FDFBF7',
            border: '1.5px solid #EFEAE2',
            borderRadius: '12px',
            padding: '0.65rem 0.75rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#D97706' }}>
              🌤 {t('buildAi.regenerative.whyModalSignalWeather')}
            </span>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              background: '#FEF3C7',
              color: '#B45309',
              padding: '1px 5px',
              borderRadius: '4px'
            }}>
              28°C
            </span>
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
            {t('buildAi.regenerative.wateringTip')}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '1px', fontWeight: 600 }}>
            {t('buildAi.regenerative.climateCondition')}
          </div>
        </div>
      </div>

      {/* Primary Hero CTA: "🤖 WHAT SHOULD I DO TODAY?" */}
      <div style={{
        background: '#15803D',
        borderRadius: '16px',
        padding: '1.1rem 1.2rem',
        color: '#FFFFFF',
        marginBottom: '0.9rem',
        boxShadow: '0 4px 14px rgba(21, 128, 61, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ flex: '1 1 220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.15rem' }}>🤖</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#BBF7D0' }}>
              {t('buildAi.todayPriority')}
            </span>
          </div>
          <h2 style={{ margin: '0 0 0.3rem 0', fontSize: '1.18rem', fontWeight: 900, lineHeight: 1.25 }}>
            {t('buildAi.regenAi')}
          </h2>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#DCFCE7', lineHeight: 1.35 }}>
            {t('buildAi.regenAiSub')}
          </p>
        </div>

        <button
          onClick={() => navigate('/build-ai/regenerative-ai')}
          style={{
            background: '#FFFFFF',
            color: '#15803D',
            border: 'none',
            borderRadius: '10px',
            padding: '0.65rem 1.1rem',
            fontWeight: 900,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          <span>{t('buildAi.getTodayAdviceBtn')}</span>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
        </button>
      </div>

      {/* Supporting Intelligence Capabilities: Satellite & Soil */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '0.65rem',
        marginBottom: '0.85rem'
      }}>
        {/* Satellite Feature Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1.5px solid #EFEAE2',
          padding: '0.9rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '0.6rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🛰️</span>
                <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: '#0F172A' }}>
                  {t('buildAi.cropHealth')}
                </h3>
              </div>
              <span style={{ fontSize: '0.66rem', fontWeight: 800, background: '#DCFCE7', color: '#15803D', padding: '1px 6px', borderRadius: '4px' }}>
                NDVI 0.72
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748B', lineHeight: 1.35 }}>
              {t('buildAi.cropHealthSub')}
            </p>
          </div>

          <button
            onClick={() => navigate('/build-ai/satellite')}
            style={{
              width: '100%',
              background: '#F0FDF4',
              color: '#15803D',
              border: '1.5px solid #BBF7D0',
              borderRadius: '8px',
              padding: '0.45rem',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem'
            }}
          >
            <span>{t('buildAi.checkFieldBtn')}</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </button>
        </div>

        {/* Soil Feature Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1.5px solid #EFEAE2',
          padding: '0.9rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '0.6rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🧪</span>
                <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: '#0F172A' }}>
                  {t('buildAi.soilHealth')}
                </h3>
              </div>
              <span style={{ fontSize: '0.66rem', fontWeight: 800, background: '#FEF3C7', color: '#92400E', padding: '1px 6px', borderRadius: '4px' }}>
                74 / 100
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748B', lineHeight: 1.35 }}>
              {t('buildAi.soilHealthSub')}
            </p>
          </div>

          <button
            onClick={() => navigate('/build-ai/soil-health')}
            style={{
              width: '100%',
              background: '#FDFBF7',
              color: '#92400E',
              border: '1.5px solid #EFEAE2',
              borderRadius: '8px',
              padding: '0.45rem',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem'
            }}
          >
            <span>{t('buildAi.checkSoilBtnHome')}</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Secondary Knowledge Link */}
      <div style={{
        background: '#FDFBF7',
        border: '1.5px solid #EFEAE2',
        borderRadius: '12px',
        padding: '0.65rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer'
      }}
      onClick={() => navigate('/build-ai/brics-hub')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.15rem' }}>🌍</span>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A' }}>
              {t('buildAi.bricsKnowledge')}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
              {t('buildAi.bricsKnowledgeSub')}
            </div>
          </div>
        </div>
        <span className="material-symbols-outlined" style={{ color: '#15803D', fontSize: '18px' }}>arrow_forward</span>
      </div>
    </BuildAiShell>
  );
};
