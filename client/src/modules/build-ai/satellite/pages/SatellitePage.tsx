import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { satelliteClientService } from '../satellite.service.js';
import { SatelliteFieldData } from '../satellite.types.js';
import { SatelliteMapCard } from '../components/SatelliteMapCard.js';
import { NdviTimeSeriesChart } from '../components/NdviTimeSeriesChart.js';
import { HealthInterpretationCard } from '../components/HealthInterpretationCard.js';
import { BuildAiShell } from '../../components/BuildAiShell.js';
import { useSharedField } from '../../context/SharedFieldContext.js';
import { useLanguage } from '../../../../context/LanguageContext.js';
import { tokens } from '../../theme.js';

export const SatellitePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { fields, selectedFieldId, selectedField, setSelectedFieldId } = useSharedField();

  const [satelliteData, setSatelliteData] = useState<SatelliteFieldData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Analysis Animation Simulation Sequence State
  const [animationStep, setAnimationStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  const animationSteps = [
    t('buildAi.satellite.simConnecting'),
    t('buildAi.satellite.simReading'),
    t('buildAi.satellite.simAnalysing'),
    t('buildAi.satellite.simCalculating'),
    t('buildAi.satellite.simComplete')
  ];

  const loadSatelliteData = async (fieldId: string) => {
    setIsLoading(true);
    setError(null);
    setAnimationStep(0);
    setIsSimulating(true);

    const res = await satelliteClientService.getSatelliteData(fieldId);
    setIsLoading(false);

    if (res.success && res.data) {
      setSatelliteData(res.data);
    } else {
      setError(typeof res.error === 'string' ? res.error : res.error?.message || t('buildAi.generalError'));
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    if (selectedFieldId) {
      loadSatelliteData(selectedFieldId);
    }
  }, [selectedFieldId]);

  // Brief animation on first load
  useEffect(() => {
    if (isLoading || error || !satelliteData) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsSimulating(false);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < animationSteps.length) {
        setAnimationStep(current);
      } else {
        clearInterval(interval);
        setTimeout(() => setIsSimulating(false), 300);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [satelliteData, isLoading, error]);

  // Derived health indicators
  const isPaddy = selectedFieldId.includes('paddy') || satelliteData?.field.crop_name.toLowerCase().includes('rice');
  const isVegetable = selectedFieldId.includes('vegetable');

  const healthScore = isPaddy ? 62 : isVegetable ? 52 : 78;
  const isWatch = healthScore >= 45 && healthScore < 70;
  const isHealthy = healthScore >= 70;

  const vegetationLabel = isPaddy ? 'Moderate' : isVegetable ? 'Moderate' : 'Good';
  const vegetationPct = isPaddy ? 62 : isVegetable ? 52 : 78;

  const moistureLabel = isPaddy ? 'Good' : 'Moderate';
  const moisturePct = isPaddy ? 76 : 58;

  const canopyLabel = isPaddy ? 'Moderate' : isVegetable ? 'Moderate' : 'Good';
  const canopyPct = isPaddy ? 60 : isVegetable ? 50 : 75;

  return (
    <BuildAiShell activeRoute="/build-ai/satellite" pageTitle={t('buildAi.cropHealth')}>
      {/* 1. Field Selector & Live/Demo Mode Indicator */}
      <div style={{
        background: tokens.colors.surfaceLight,
        borderRadius: tokens.radii.md,
        padding: '0.65rem 0.85rem',
        border: `1.5px solid ${tokens.colors.borderDefault}`,
        marginBottom: '0.85rem',
        boxShadow: tokens.shadows.subtle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flex: '1 1 auto', minWidth: 0 }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: tokens.radii.sm,
            background: tokens.colors.primaryBg,
            color: tokens.colors.primaryLeaf,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>satellite_alt</span>
          </div>

          <div style={{ minWidth: 0, flex: '1 1 auto' }}>
            <label htmlFor="field-select" style={{ display: 'block', fontSize: tokens.typography.micro, color: tokens.colors.textMuted, fontWeight: 800, textTransform: 'uppercase', marginBottom: '1px' }}>
              {t('buildAi.fieldSelect')}
            </label>
            <select
              id="field-select"
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(e.target.value)}
              style={{
                background: tokens.colors.surfaceAlt,
                color: tokens.colors.textPrimary,
                border: `1.5px solid #CBD5E1`,
                borderRadius: tokens.radii.sm,
                padding: '0.25rem 0.45rem',
                fontSize: tokens.typography.small,
                fontWeight: 800,
                outline: 'none',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            >
              {fields.map(f => (
                <option key={f.id} value={f.id}>
                  {f.field_name} ({f.crop_name} • {f.area_acres} ac)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Satellite Mode Badge (Demo Transparency) */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '2px 8px',
          borderRadius: tokens.radii.full,
          fontSize: tokens.typography.micro,
          fontWeight: 800,
          background: satelliteData?.source === 'live' ? tokens.colors.statusGoodBg : tokens.colors.statusWatchBg,
          color: satelliteData?.source === 'live' ? tokens.colors.statusGood : tokens.colors.statusWatch,
          border: `1px solid ${satelliteData?.source === 'live' ? tokens.colors.statusGoodBorder : tokens.colors.statusWatchBorder}`,
          flexShrink: 0
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: satelliteData?.source === 'live' ? tokens.colors.statusGood : tokens.colors.statusWatch
          }} />
          <span>{satelliteData?.source === 'live' ? t('buildAi.liveDataBadge') : t('buildAi.demoDataBadge')}</span>
        </div>
      </div>

      {/* 2. Simulation Animation Sequence */}
      {isSimulating && !error && (
        <div style={{
          background: '#0F172A',
          color: '#FFFFFF',
          borderRadius: tokens.radii.md,
          padding: '1.25rem 1rem',
          textAlign: 'center',
          marginBottom: '0.85rem',
          boxShadow: tokens.shadows.elevated
        }}>
          <div style={{ display: 'inline-flex', padding: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', marginBottom: '0.4rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#86EFAC' }}>satellite_alt</span>
          </div>
          <div style={{ fontSize: tokens.typography.micro, color: '#86EFAC', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            DEMO SATELLITE PIPELINE
          </div>
          <div style={{ fontSize: '0.94rem', fontWeight: 900, marginTop: '4px' }}>
            {animationSteps[animationStep]}
          </div>

          <div style={{
            maxWidth: '180px',
            height: '4px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
            margin: '0.75rem auto 0 auto',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((animationStep + 1) / animationSteps.length) * 100}%`,
              height: '100%',
              background: '#22C55E',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div style={{
          background: tokens.colors.statusAlertBg,
          border: `1px solid ${tokens.colors.statusAlertBorder}`,
          borderRadius: tokens.radii.md,
          padding: '0.85rem',
          color: tokens.colors.statusAlert,
          marginBottom: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: tokens.typography.small }}>{t('buildAi.generalError')}</div>
            <div style={{ fontSize: tokens.typography.micro }}>{error}</div>
          </div>
          <button
            onClick={() => loadSatelliteData(selectedFieldId)}
            style={{
              padding: '0.35rem 0.65rem',
              background: tokens.colors.statusAlert,
              color: '#fff',
              border: 'none',
              borderRadius: tokens.radii.xs,
              fontSize: tokens.typography.small,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {t('buildAi.retryBtn')}
          </button>
        </div>
      )}

      {/* Main Workspace (Responsive: Desktop 65/35 Split, Mobile Stacked Flow) */}
      {!isLoading && !error && satelliteData && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem',
          alignItems: 'start'
        }}>
          {/* Left / Desktop Primary (65%): Map & NDVI Trend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* LARGE VISUAL FIELD MAP */}
            <SatelliteMapCard
              field={satelliteData.field}
              currentNdvi={satelliteData.ndviSummary.currentNdvi}
              healthStatus={satelliteData.ndviSummary.healthStatus}
              zones={satelliteData.zones}
            />

            {/* NDVI TREND OVER TIME */}
            <NdviTimeSeriesChart observations={satelliteData.observations} />
          </div>

          {/* Right / Desktop Secondary (35%): Crop Health KPI, Meaning & Next Step */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* FIELD HEALTH STATUS BANNER */}
            <div style={{
              background: isHealthy ? tokens.colors.statusGoodBg : isWatch ? tokens.colors.statusWatchBg : tokens.colors.statusAlertBg,
              border: `1.5px solid ${isHealthy ? tokens.colors.statusGoodBorder : isWatch ? tokens.colors.statusWatchBorder : tokens.colors.statusAlertBorder}`,
              borderRadius: tokens.radii.md,
              padding: '0.85rem 1rem',
              boxShadow: tokens.shadows.subtle
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: tokens.typography.micro, color: isHealthy ? tokens.colors.statusGood : tokens.colors.statusWatch, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {selectedField?.field_name || 'EAST WHEAT PARCEL'}
                </span>
                <span style={{
                  fontSize: tokens.typography.micro,
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: tokens.radii.full,
                  background: isHealthy ? '#DCFCE7' : isWatch ? '#FEF3C7' : '#FEE2E2',
                  color: isHealthy ? tokens.colors.statusGood : isWatch ? tokens.colors.statusWatch : tokens.colors.statusAlert
                }}>
                  {isHealthy ? t('buildAi.good') : isWatch ? t('buildAi.needsCare') : t('buildAi.critical')}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '1.85rem', fontWeight: 900, color: tokens.colors.textPrimary, lineHeight: 1 }}>
                  NDVI 0.72
                </span>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: isHealthy ? tokens.colors.statusGood : tokens.colors.statusWatch }}>
                  {isHealthy ? t('buildAi.satellite.cropsLookingHealthy') : t('buildAi.satellite.growthStressSouthern')}
                </span>
              </div>

              {/* Visual Health Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.6rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: tokens.typography.micro, fontWeight: 700, marginBottom: '2px' }}>
                    <span style={{ color: tokens.colors.textSecondary }}>{t('buildAi.satellite.barVegetation')}</span>
                    <span style={{ color: tokens.colors.textPrimary }}>{vegetationLabel}</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${vegetationPct}%`, height: '100%', background: tokens.colors.primaryLeaf, borderRadius: '3px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: tokens.typography.micro, fontWeight: 700, marginBottom: '2px' }}>
                    <span style={{ color: tokens.colors.textSecondary }}>{t('buildAi.satellite.barMoisture')}</span>
                    <span style={{ color: tokens.colors.textPrimary }}>{moistureLabel}</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${moisturePct}%`, height: '100%', background: tokens.colors.sky, borderRadius: '3px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: tokens.typography.micro, fontWeight: 700, marginBottom: '2px' }}>
                    <span style={{ color: tokens.colors.textSecondary }}>{t('buildAi.satellite.barCanopy')}</span>
                    <span style={{ color: tokens.colors.textPrimary }}>{canopyLabel}</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${canopyPct}%`, height: '100%', background: '#65A30D', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* WHAT THIS MEANS & NEXT ACTIONS */}
            <HealthInterpretationCard
              interpretation={satelliteData.interpretation}
              modelMetadata={satelliteData.modelMetadata}
            />
          </div>
        </div>
      )}
    </BuildAiShell>
  );
};
