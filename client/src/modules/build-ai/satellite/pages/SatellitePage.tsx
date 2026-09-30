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
    'Connecting to satellite data...',
    'Reading field boundary...',
    'Analysing vegetation...',
    'Calculating NDVI...',
    'Field analysis complete'
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

  // Run brief 1.5–2.0 second UI simulation sequence on field load
  useEffect(() => {
    if (isLoading || error || !satelliteData) return;

    // Check if user prefers reduced motion
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
    }, 380);

    return () => clearInterval(interval);
  }, [satelliteData, isLoading, error]);

  // Calculate Field Health Score (0-100) and Sub-metrics from Demo Data
  const isPaddy = selectedFieldId.includes('paddy') || satelliteData?.field.crop_name.toLowerCase().includes('rice');
  const isVegetable = selectedFieldId.includes('vegetable');

  const healthScore = isPaddy ? 62 : isVegetable ? 52 : 78;
  const isWatch = healthScore >= 45 && healthScore < 70;
  const isHealthy = healthScore >= 70;

  // Visual Progress Metrics: Vegetation, Moisture, Canopy
  const vegetationLabel = isPaddy ? 'Moderate' : isVegetable ? 'Moderate' : 'Good';
  const vegetationPct = isPaddy ? 62 : isVegetable ? 52 : 78;

  const moistureLabel = isPaddy ? 'Good' : 'Moderate';
  const moisturePct = isPaddy ? 76 : 58;

  const canopyLabel = isPaddy ? 'Moderate' : isVegetable ? 'Moderate' : 'Good';
  const canopyPct = isPaddy ? 60 : isVegetable ? 50 : 75;

  return (
    <BuildAiShell activeRoute="/build-ai/satellite" pageTitle="Satellite Crop Health">
      {/* 1. Field Selector & 2. Demo/Live Mode Badge */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '0.65rem 0.8rem',
        border: '1px solid #E2E8F0',
        marginBottom: '0.75rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto', minWidth: 0, maxWidth: '100%' }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: '#F0FDF4',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>grass</span>
          </div>
          <div style={{ minWidth: 0, flex: '1 1 auto' }}>
            <label htmlFor="field-select" style={{ display: 'block', fontSize: '0.62rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1px' }}>
              {t('buildAi.fieldSelect')}
            </label>
            <select
              id="field-select"
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(e.target.value)}
              style={{
                background: '#F8FAFC',
                color: '#0F172A',
                border: '1.5px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0.25rem 0.4rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                outline: 'none',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                textOverflow: 'ellipsis'
              }}
            >
              {fields.map(f => (
                <option key={f.id} value={f.id}>
                  🌾 {f.field_name} ({f.crop_name} • {f.area_acres} ac)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 15. Explicit Demo Mode Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '2px 8px',
          borderRadius: '9999px',
          fontSize: '0.68rem',
          fontWeight: 800,
          background: satelliteData?.source === 'live' ? '#DCFCE7' : '#FEF3C7',
          color: satelliteData?.source === 'live' ? '#15803D' : '#92400E',
          border: `1px solid ${satelliteData?.source === 'live' ? '#BBF7D0' : '#FDE68A'}`,
          flexShrink: 0
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: satelliteData?.source === 'live' ? '#16A34A' : '#D97706'
          }} />
          <span>{satelliteData?.source === 'live' ? '🛰 LIVE SATELLITE DATA' : '🛰 DEMO SATELLITE ANALYSIS'}</span>
        </div>
      </div>

      {/* 6. Satellite Analysis Simulation Animation Overlay on First Load / Field Change */}
      {isSimulating && !error && (
        <div style={{
          background: '#0F172A',
          color: '#FFFFFF',
          borderRadius: '14px',
          padding: '1.5rem 1rem',
          textAlign: 'center',
          marginBottom: '0.75rem',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛰️</div>
          <div style={{ fontSize: '0.74rem', color: '#86EFAC', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            DEMO SATELLITE PIPELINE
          </div>
          <div style={{ fontSize: '0.94rem', fontWeight: 900, marginTop: '4px' }}>
            {animationSteps[animationStep]}
          </div>

          {/* Micro progress indicator */}
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

      {/* Error state if any */}
      {error && !isLoading && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '12px',
          padding: '0.85rem',
          color: '#991B1B',
          marginBottom: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>{t('buildAi.generalError')}</div>
            <div style={{ fontSize: '0.75rem' }}>{error}</div>
          </div>
          <button
            onClick={() => loadSatelliteData(selectedFieldId)}
            style={{
              padding: '0.35rem 0.65rem',
              background: '#DC2626',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {t('buildAi.retryBtn')}
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      {!isLoading && !error && satelliteData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* 3. & 8. FIELD HEALTH SUMMARY Card */}
          <div style={{
            background: isHealthy ? '#F0FDF4' : isWatch ? '#FFFBEB' : '#FEF2F2',
            border: `1.5px solid ${isHealthy ? '#BBF7D0' : isWatch ? '#FDE68A' : '#FECACA'}`,
            borderRadius: '14px',
            padding: '0.85rem 1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.72rem', color: isHealthy ? '#15803D' : '#92400E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                🌾 FIELD HEALTH
              </span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 900,
                padding: '2px 8px',
                borderRadius: '9999px',
                background: isHealthy ? '#DCFCE7' : isWatch ? '#FEF3C7' : '#FEE2E2',
                color: isHealthy ? '#15803D' : isWatch ? '#B45309' : '#B91C1C'
              }}>
                {isHealthy ? '🟢 Healthy' : isWatch ? '🟡 Needs attention' : '🔴 Stressed'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                {healthScore} / 100
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isHealthy ? '#15803D' : '#92400E' }}>
                {isHealthy ? 'Crops looking healthy' : 'Growth stress in southern parcel'}
              </span>
            </div>

            {/* Visual Health Bars: Vegetation, Moisture, Canopy */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.5rem' }}>
              {/* Vegetation */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, marginBottom: '2px' }}>
                  <span style={{ color: '#475569' }}>Vegetation</span>
                  <span style={{ color: '#0F172A' }}>{vegetationLabel}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${vegetationPct}%`, height: '100%', background: '#16A34A', borderRadius: '3px' }} />
                </div>
              </div>

              {/* Moisture */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, marginBottom: '2px' }}>
                  <span style={{ color: '#475569' }}>Moisture</span>
                  <span style={{ color: '#0F172A' }}>{moistureLabel}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${moisturePct}%`, height: '100%', background: '#0284C7', borderRadius: '3px' }} />
                </div>
              </div>

              {/* Canopy */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, marginBottom: '2px' }}>
                  <span style={{ color: '#475569' }}>Canopy</span>
                  <span style={{ color: '#0F172A' }}>{canopyLabel}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${canopyPct}%`, height: '100%', background: '#65A30D', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* 4. & 5. Satellite Visualization & Layer Tabs & Interactive Zones & Continuous Scale */}
          <SatelliteMapCard
            field={satelliteData.field}
            currentNdvi={satelliteData.ndviSummary.currentNdvi}
            healthStatus={satelliteData.ndviSummary.healthStatus}
            zones={satelliteData.zones}
          />

          {/* 7. NDVI Trend Analysis Timeline */}
          <NdviTimeSeriesChart observations={satelliteData.observations} />

          {/* 9. & 10. "What does this mean?", "What to check", & Next Steps */}
          <HealthInterpretationCard
            interpretation={satelliteData.interpretation}
            modelMetadata={satelliteData.modelMetadata}
          />
        </div>
      )}
    </BuildAiShell>
  );
};
