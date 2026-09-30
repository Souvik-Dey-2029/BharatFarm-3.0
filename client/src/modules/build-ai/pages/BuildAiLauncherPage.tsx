import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildAiShell } from '../components/BuildAiShell.js';
import { useSharedField } from '../context/SharedFieldContext.js';
import { useLanguage } from '../../../context/LanguageContext.js';
import { tokens } from '../theme.js';

export const BuildAiLauncherPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { fields, selectedFieldId, selectedField, setSelectedFieldId, isLoadingFields } = useSharedField();
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState(false);

  // Field details fallback
  const fieldName = selectedField?.field_name || 'East Wheat Parcel';
  const cropName = selectedField?.crop_name || 'Wheat';
  const acreage = selectedField?.area_acres || 3.8;

  return (
    <BuildAiShell activeRoute="/build-ai">
      {/* 1. Header & Refined Field Selector with Subtle Field Preview */}
      <div style={{
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}>
        {/* Brand Subtitle Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.4rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: tokens.colors.primaryBg,
            border: `1px solid ${tokens.colors.statusGoodBorder}`,
            color: tokens.colors.primaryLeaf,
            padding: '3px 10px',
            borderRadius: tokens.radii.full,
            fontSize: tokens.typography.micro,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>eco</span>
            <span>{t('buildAi.appSubtitle')}</span>
          </div>

          {/* Quick link to SIH Field Mapping */}
          <button
            onClick={() => navigate('/sih/field-mapping')}
            style={{
              background: 'transparent',
              border: `1px solid ${tokens.colors.borderDefault}`,
              borderRadius: tokens.radii.sm,
              padding: '3px 8px',
              fontSize: tokens.typography.small,
              fontWeight: 700,
              color: tokens.colors.earth,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>map</span>
            <span>{t('home.fieldMappingShort')}</span>
          </button>
        </div>

        {/* Refined Field Selector Box (Agricultural Thumbnail + Selector Pill) */}
        <div style={{
          background: tokens.colors.surfaceLight,
          borderRadius: tokens.radii.md,
          border: `1.5px solid ${tokens.colors.borderDefault}`,
          padding: '0.65rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          boxShadow: tokens.shadows.subtle
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: '1 1 auto', minWidth: 0 }}>
            {/* Subtle Field Image Thumbnail */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: tokens.radii.sm,
              overflow: 'hidden',
              flexShrink: 0,
              position: 'relative',
              background: '#0F172A',
              border: `1px solid ${tokens.colors.statusGoodBorder}`
            }}>
              <img
                src="/images/tools/satellite.jpg"
                alt="Field preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '10px',
                height: '10px',
                background: tokens.colors.statusGood,
                borderRadius: '50%',
                border: '1.5px solid #FFFFFF'
              }} />
            </div>

            {/* Field Info & Custom Trigger */}
            <div style={{ minWidth: 0, flex: '1 1 auto' }}>
              <div style={{
                fontSize: tokens.typography.micro,
                fontWeight: 800,
                color: tokens.colors.primaryLeaf,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {t('buildAi.fieldSelect')}
              </div>

              {isLoadingFields ? (
                <div style={{ fontSize: tokens.typography.small, color: tokens.colors.textMuted }}>{t('common.loading')}</div>
              ) : (
                <div
                  onClick={() => setIsFieldDropdownOpen(!isFieldDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <span style={{
                    fontSize: '0.92rem',
                    fontWeight: 900,
                    color: tokens.colors.textPrimary,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {fieldName} · <span style={{ color: tokens.colors.earth, fontWeight: 700 }}>{cropName} · {acreage} ac</span>
                  </span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: tokens.colors.textSecondary }}>
                    {isFieldDropdownOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Collapsible Dropdown Menu */}
          {isFieldDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: tokens.colors.surfaceLight,
              border: `1.5px solid ${tokens.colors.borderDefault}`,
              borderRadius: tokens.radii.md,
              boxShadow: tokens.shadows.elevated,
              zIndex: 30,
              padding: '0.35rem',
              maxHeight: '220px',
              overflowY: 'auto'
            }}>
              {fields.map(f => (
                <div
                  key={f.id}
                  onClick={() => {
                    setSelectedFieldId(f.id);
                    setIsFieldDropdownOpen(false);
                  }}
                  style={{
                    padding: '0.5rem 0.65rem',
                    borderRadius: tokens.radii.sm,
                    background: f.id === selectedFieldId ? tokens.colors.primaryBg : 'transparent',
                    color: f.id === selectedFieldId ? tokens.colors.primaryDeep : tokens.colors.textPrimary,
                    fontWeight: f.id === selectedFieldId ? 800 : 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{f.field_name} ({f.crop_name} • {f.area_acres} ac)</span>
                  {f.id === selectedFieldId && (
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: tokens.colors.statusGood }}>check</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .home-grid-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          align-items: start;
          width: 100%;
          box-sizing: border-box;
        }
        .home-grid-column {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          width: 100%;
          box-sizing: border-box;
        }
        @media (max-width: 860px) {
          .home-grid-container {
            display: flex;
            flex-direction: column;
            gap: 0.9rem;
            align-items: stretch;
            width: 100%;
          }
          .home-grid-column {
            width: 100% !important;
          }
        }
      `}</style>

      {/* Responsive Layout Grid: Desktop 2-Column Split, Mobile Strict Priority Flow */}
      <div className="home-grid-container">
        {/* Left Column / Mobile Flow */}
        <div className="home-grid-column">
          {/* 2. FIELD SNAPSHOT: Unified "Field Today" Composition */}
          <div className="home-slot-snapshot" style={{
            background: tokens.colors.surfaceLight,
            borderRadius: tokens.radii.lg,
            border: `1.5px solid ${tokens.colors.borderDefault}`,
            padding: '1rem',
            boxShadow: tokens.shadows.subtle
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.65rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: tokens.colors.primaryLeaf }}>wb_sunny</span>
                <span style={{
                  fontSize: tokens.typography.micro,
                  fontWeight: 800,
                  color: tokens.colors.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {t('buildAi.fieldToday')}
                </span>
              </div>
              <span style={{
                fontSize: tokens.typography.micro,
                fontWeight: 800,
                color: tokens.colors.statusGood,
                background: tokens.colors.statusGoodBg,
                padding: '2px 8px',
                borderRadius: tokens.radii.full
              }}>
                {t('buildAi.good')}
              </span>
            </div>

            {/* 3 Metric Clusters: Crop, Soil, Climate */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              background: tokens.colors.surfaceAlt,
              borderRadius: tokens.radii.md,
              padding: '0.75rem 0.6rem',
              border: `1px solid ${tokens.colors.borderDefault}`
            }}>
              {/* Crop metric */}
              <div
                onClick={() => navigate('/build-ai/satellite')}
                style={{ cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ fontSize: tokens.typography.micro, color: tokens.colors.textMuted, fontWeight: 700 }}>
                  NDVI
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: tokens.colors.primaryDeep, lineHeight: 1.15 }}>
                  0.72
                </div>
                <div style={{ fontSize: tokens.typography.micro, color: tokens.colors.statusGood, fontWeight: 800, marginTop: '2px' }}>
                  {t('buildAi.good')}
                </div>
              </div>

              {/* Soil metric */}
              <div
                onClick={() => navigate('/build-ai/soil-health')}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  borderLeft: `1px solid ${tokens.colors.borderDefault}`,
                  borderRight: `1px solid ${tokens.colors.borderDefault}`
                }}
              >
                <div style={{ fontSize: tokens.typography.micro, color: tokens.colors.textMuted, fontWeight: 700 }}>
                  Soil Health
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: tokens.colors.textPrimary, lineHeight: 1.15 }}>
                  74/100
                </div>
                <div style={{ fontSize: tokens.typography.micro, color: tokens.colors.statusWatch, fontWeight: 800, marginTop: '2px' }}>
                  {t('buildAi.moderate')}
                </div>
              </div>

              {/* Climate metric */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: tokens.typography.micro, color: tokens.colors.textMuted, fontWeight: 700 }}>
                  Climate
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: tokens.colors.textPrimary, lineHeight: 1.15 }}>
                  28°C
                </div>
                <div style={{ fontSize: tokens.typography.micro, color: tokens.colors.sky, fontWeight: 800, marginTop: '2px' }}>
                  Rain possible
                </div>
              </div>
            </div>
          </div>

          {/* 4. SECONDARY INTELLIGENCE: Two Compact Diagnostic Modules */}
          <div className="home-slot-diagnostics" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.65rem'
          }}>
            {/* CROP HEALTH Card */}
            <div style={{
              background: tokens.colors.surfaceLight,
              borderRadius: tokens.radii.md,
              border: `1.5px solid ${tokens.colors.borderDefault}`,
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.65rem',
              boxShadow: tokens.shadows.subtle
            }}>
              <div>
                {/* Crop Satellite Image Banner */}
                <div style={{
                  width: '100%',
                  height: '75px',
                  borderRadius: tokens.radii.sm,
                  overflow: 'hidden',
                  marginBottom: '0.5rem',
                  border: `1px solid ${tokens.colors.borderDefault}`
                }}>
                  <img
                    src="/images/tools/satellite.jpg"
                    alt="Crop Vegetation Satellite"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '17px', color: tokens.colors.primaryLeaf }}>satellite_alt</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: tokens.colors.textPrimary }}>
                      {t('buildAi.cropHealth')}
                    </span>
                  </div>
                  <span style={{
                    fontSize: tokens.typography.micro,
                    fontWeight: 800,
                    background: tokens.colors.statusGoodBg,
                    color: tokens.colors.statusGood,
                    padding: '1px 5px',
                    borderRadius: tokens.radii.xs
                  }}>
                    {t('buildAi.good')}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: tokens.colors.primaryDeep, lineHeight: 1 }}>
                    0.72
                  </span>
                  <span style={{ fontSize: tokens.typography.micro, color: tokens.colors.textMuted, fontWeight: 700 }}>
                    NDVI • Stable
                  </span>
                </div>

                {/* Micro vegetation bar */}
                <div style={{
                  width: '100%',
                  height: '5px',
                  background: '#E2E8F0',
                  borderRadius: '3px',
                  marginTop: '0.5rem',
                  overflow: 'hidden'
                }}>
                  <div style={{ width: '72%', height: '100%', background: tokens.colors.primaryLeaf, borderRadius: '3px' }} />
                </div>
              </div>

              <button
                onClick={() => navigate('/build-ai/satellite')}
                style={{
                  width: '100%',
                  background: tokens.colors.primaryBg,
                  color: tokens.colors.primaryLeaf,
                  border: `1px solid ${tokens.colors.statusGoodBorder}`,
                  borderRadius: tokens.radii.sm,
                  padding: '0.4rem',
                  fontSize: tokens.typography.small,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <span>{t('buildAi.viewFieldBtn')}</span>
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_forward</span>
              </button>
            </div>

            {/* SOIL HEALTH Card */}
            <div style={{
              background: tokens.colors.surfaceLight,
              borderRadius: tokens.radii.md,
              border: `1.5px solid ${tokens.colors.borderDefault}`,
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.65rem',
              boxShadow: tokens.shadows.subtle
            }}>
              <div>
                {/* Soil Health Image Banner */}
                <div style={{
                  width: '100%',
                  height: '75px',
                  borderRadius: tokens.radii.sm,
                  overflow: 'hidden',
                  marginBottom: '0.5rem',
                  border: `1px solid ${tokens.colors.borderDefault}`
                }}>
                  <img
                    src="/images/tools/soil.jpg"
                    alt="Soil Chemistry Testing"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '17px', color: tokens.colors.clay }}>potted_plant</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: tokens.colors.textPrimary }}>
                      {t('buildAi.soilHealth')}
                    </span>
                  </div>
                  <span style={{
                    fontSize: tokens.typography.micro,
                    fontWeight: 800,
                    background: tokens.colors.statusWatchBg,
                    color: tokens.colors.statusWatch,
                    padding: '1px 5px',
                    borderRadius: tokens.radii.xs
                  }}>
                    {t('buildAi.moderate')}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: tokens.colors.textPrimary, lineHeight: 1 }}>
                    74
                  </span>
                  <span style={{ fontSize: tokens.typography.micro, color: tokens.colors.textMuted, fontWeight: 700 }}>
                    / 100 • pH 6.5
                  </span>
                </div>

                {/* Micro soil gauge bar */}
                <div style={{
                  width: '100%',
                  height: '5px',
                  background: '#E2E8F0',
                  borderRadius: '3px',
                  marginTop: '0.5rem',
                  overflow: 'hidden'
                }}>
                  <div style={{ width: '74%', height: '100%', background: tokens.colors.clay, borderRadius: '3px' }} />
                </div>
              </div>

              <button
                onClick={() => navigate('/build-ai/soil-health')}
                style={{
                  width: '100%',
                  background: tokens.colors.surfaceAlt,
                  color: tokens.colors.earth,
                  border: `1px solid ${tokens.colors.borderDefault}`,
                  borderRadius: tokens.radii.sm,
                  padding: '0.4rem',
                  fontSize: tokens.typography.small,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <span>{t('buildAi.viewSoilBtn')}</span>
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column / Mobile Secondary Stack */}
        <div className="home-grid-column">
          {/* 3. PRIMARY ACTION: High-Contrast "Today's Decision" Panel */}
          <div className="home-slot-priority" style={{
            background: tokens.colors.primaryDeep,
            borderRadius: tokens.radii.lg,
            padding: '1.15rem 1.25rem',
            color: '#FFFFFF',
            boxShadow: '0 6px 18px rgba(20, 83, 45, 0.28)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.85rem'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(255, 255, 255, 0.12)',
                padding: '2px 8px',
                borderRadius: tokens.radii.full,
                fontSize: tokens.typography.micro,
                fontWeight: 800,
                color: '#BBF7D0',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '0.45rem'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>psychology</span>
                <span>{t('buildAi.todayPriority')}</span>
              </div>

              <h2 style={{
                margin: '0 0 0.35rem 0',
                fontSize: '1.22rem',
                fontWeight: 900,
                lineHeight: 1.25,
                color: '#FFFFFF'
              }}>
                {t('buildAi.priorityDecisionTitle')}
              </h2>

              <p style={{
                margin: 0,
                fontSize: '0.8rem',
                color: '#DCFCE7',
                lineHeight: 1.4,
                fontWeight: 500
              }}>
                <strong style={{ color: '#FFFFFF' }}>{t('buildAi.whyQuestion')} </strong>
                {t('buildAi.priorityDecisionBecause')}
              </p>
            </div>

            <button
              onClick={() => navigate('/build-ai/regenerative-ai')}
              style={{
                width: '100%',
                background: '#FFFFFF',
                color: tokens.colors.primaryDeep,
                border: 'none',
                borderRadius: tokens.radii.sm,
                padding: '0.65rem 1rem',
                fontWeight: 900,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                transition: 'transform 0.15s ease'
              }}
            >
              <span>{t('buildAi.seeAdviceAction')}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </button>
          </div>

          {/* 5. KNOWLEDGE: Subordinated Agricultural Practice Teaser */}
          <div
            className="home-slot-brics"
            onClick={() => navigate('/build-ai/brics-hub')}
            style={{
              background: tokens.colors.surfaceAlt,
              borderRadius: tokens.radii.md,
              border: `1.5px solid ${tokens.colors.borderDefault}`,
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              gap: '0.75rem',
              boxShadow: tokens.shadows.subtle
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: tokens.radii.sm,
                background: '#F0FDF4',
                color: tokens.colors.primaryLeaf,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>public</span>
              </div>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: tokens.colors.textPrimary }}>
                  {t('buildAi.explorePracticesTitle')}
                </div>
                <div style={{ fontSize: tokens.typography.micro, color: tokens.colors.textMuted, marginTop: '2px', fontWeight: 600 }}>
                  {t('buildAi.bricsCountriesList')}
                </div>
              </div>
            </div>

            <span className="material-symbols-outlined" style={{ color: tokens.colors.primaryLeaf, fontSize: '18px', flexShrink: 0 }}>
              arrow_forward
            </span>
          </div>
        </div>
      </div>
    </BuildAiShell>
  );
};
