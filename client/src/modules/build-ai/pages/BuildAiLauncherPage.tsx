import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildAiShell } from '../components/BuildAiShell.js';
import { useSharedField } from '../context/SharedFieldContext.js';
import { useLanguage } from '../../../context/LanguageContext.js';

export const BuildAiLauncherPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { fields, selectedFieldId, selectedField, setSelectedFieldId, isLoadingFields } = useSharedField();

  const toolCards = [
    {
      id: 'satellite',
      title: t('buildAi.cropHealth'),
      desc: t('buildAi.cropHealthSub'),
      route: '/build-ai/satellite',
      icon: 'satellite_alt',
      image: '/images/tools/satellite.jpg',
      badge: 'NDVI'
    },
    {
      id: 'soil',
      title: t('buildAi.soilHealth'),
      desc: t('buildAi.soilHealthSub'),
      route: '/build-ai/soil-health',
      icon: 'potted_plant',
      image: '/images/tools/soil.jpg',
      badge: 'NPK & pH'
    },
    {
      id: 'regenerative',
      title: t('buildAi.regenAi'),
      desc: t('buildAi.regenAiSub'),
      route: '/build-ai/regenerative-ai',
      icon: 'psychology',
      image: '/images/tools/regenerative.jpg',
      badge: 'AI Plan'
    },
    {
      id: 'brics',
      title: t('buildAi.bricsKnowledge'),
      desc: t('buildAi.bricsKnowledgeSub'),
      route: '/build-ai/brics-hub',
      icon: 'public',
      image: '/images/tools/brics.jpg',
      badge: '5 Nations'
    }
  ];

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
        border: '1px solid #E2E8F0',
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
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Loading fields...</div>
            ) : fields.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '2px' }}>
                <select
                  value={selectedFieldId}
                  onChange={(e) => setSelectedFieldId(e.target.value)}
                  style={{
                    background: '#F8FAFC',
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

      {/* 2-Column Compact Status Snapshot: Crop Health & Soil Health */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.65rem',
        marginBottom: '0.9rem'
      }}>
        {/* Crop Status Card */}
        <div
          onClick={() => navigate('/build-ai/satellite')}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #BBF7D0',
            borderRadius: '14px',
            padding: '0.75rem',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#15803D' }}>
              🌿 {t('buildAi.cropHealth')}
            </span>
            <span style={{
              fontSize: '0.66rem',
              fontWeight: 800,
              background: '#DCFCE7',
              color: '#15803D',
              padding: '1px 6px',
              borderRadius: '6px'
            }}>
              {t('buildAi.healthy')}
            </span>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
            {t('buildAi.lookingGood')}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
            {t('buildAi.ndviScore')}: 0.72 ({t('buildAi.normalRange')})
          </div>
        </div>

        {/* Soil Status Card */}
        <div
          onClick={() => navigate('/build-ai/soil-health')}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #BAE6FD',
            borderRadius: '14px',
            padding: '0.75rem',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369A1' }}>
              🧪 {t('buildAi.soilHealth')}
            </span>
            <span style={{
              fontSize: '0.66rem',
              fontWeight: 800,
              background: '#E0F2FE',
              color: '#0369A1',
              padding: '1px 6px',
              borderRadius: '6px'
            }}>
              {t('buildAi.good')}
            </span>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
            74 / 100
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
            pH 6.5 • OC 0.62%
          </div>
        </div>
      </div>

      {/* Section Title: "What do you want to check?" */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.65rem'
      }}>
        <h2 style={{
          fontSize: '0.94rem',
          fontWeight: 900,
          color: '#0F172A',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <span className="material-symbols-outlined" style={{ color: '#16A34A', fontSize: '18px' }}>apps</span>
          <span>{t('home.whatToDoTitle')}</span>
        </h2>
        <span style={{
          fontSize: '0.68rem',
          fontWeight: 800,
          color: '#15803D',
          background: '#DCFCE7',
          padding: '0.1rem 0.45rem',
          borderRadius: '8px'
        }}>
          4 {t('home.solutionsTitle')}
        </span>
      </div>

      {/* 2-Column Responsive Compact Grid for the 4 Capabilities */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.65rem'
      }}>
        {toolCards.map((card) => (
          <div
            key={card.id}
            onClick={() => navigate(card.route)}
            style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              border: '1.5px solid #E2E8F0',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.12s ease'
            }}
          >
            {/* Thumbnail Image Header */}
            <div style={{ position: 'relative', width: '100%', height: '84px', overflow: 'hidden', background: '#E2E8F0' }}>
              <img
                src={card.image}
                alt={card.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(3px)',
                color: '#FFFFFF',
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '9999px'
              }}>
                {card.badge}
              </div>
            </div>

            {/* Compact Body */}
            <div style={{ padding: '0.65rem 0.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#16A34A' }}>{card.icon}</span>
                  <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.2 }}>
                    {card.title}
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B', lineHeight: 1.3, fontWeight: 500 }}>
                  {card.desc}
                </p>
              </div>

              {/* Action Link */}
              <div style={{
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#15803D',
                fontSize: '0.74rem',
                fontWeight: 800,
                borderTop: '1px solid #F1F5F9',
                paddingTop: '0.4rem'
              }}>
                <span>{t('buildAi.exploreTool')}</span>
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_forward</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BuildAiShell>
  );
};
