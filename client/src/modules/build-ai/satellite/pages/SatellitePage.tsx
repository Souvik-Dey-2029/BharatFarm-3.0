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
  const [showNdviDetails, setShowNdviDetails] = useState<boolean>(false);

  const loadSatelliteData = async (fieldId: string) => {
    setIsLoading(true);
    setError(null);

    const res = await satelliteClientService.getSatelliteData(fieldId);
    setIsLoading(false);

    if (res.success && res.data) {
      setSatelliteData(res.data);
    } else {
      setError(typeof res.error === 'string' ? res.error : res.error?.message || t('buildAi.generalError'));
    }
  };

  useEffect(() => {
    if (selectedFieldId) {
      loadSatelliteData(selectedFieldId);
    }
  }, [selectedFieldId]);

  // Compute 0-100 Crop Health Score from current NDVI (e.g., 0.72 -> 72/100)
  const healthScore = satelliteData ? Math.round(satelliteData.ndviSummary.currentNdvi * 100) : 72;
  const isHealthy = healthScore >= 65;
  const isWatch = healthScore >= 45 && healthScore < 65;

  return (
    <BuildAiShell activeRoute="/build-ai/satellite" pageTitle={t('buildAi.cropHealth')}>
      {/* Field Selector & Demo Transparency Pill */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '0.75rem 0.9rem',
        border: '1px solid #E2E8F0',
        marginBottom: '0.75rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.6rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flex: '1 1 200px' }}>
          <div style={{
            width: '32px',
            height: '32px',
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
          <div style={{ minWidth: 0 }}>
            <label htmlFor="field-select" style={{ display: 'block', fontSize: '0.65rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1px' }}>
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
        </div>

        {/* Demo Transparency Badge */}
        {satelliteData && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '0.68rem',
            fontWeight: 800,
            background: satelliteData.source === 'live' ? '#DCFCE7' : '#FEF3C7',
            color: satelliteData.source === 'live' ? '#15803D' : '#92400E',
            border: `1px solid ${satelliteData.source === 'live' ? '#BBF7D0' : '#FDE68A'}`
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: satelliteData.source === 'live' ? '#16A34A' : '#D97706'
            }} />
            <span>{satelliteData.source === 'live' ? 'LIVE SATELLITE' : 'Sample field · Demo analysis'}</span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '2rem 1rem',
          textAlign: 'center',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>🛰️</div>
          <p style={{ margin: 0, fontWeight: 800, color: '#334155', fontSize: '0.85rem' }}>
            Checking crop health...
          </p>
        </div>
      )}

      {/* Error State */}
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
          {/* Top Card: 🌾 CROP HEALTH [Health score / status] */}
          <div style={{
            background: isHealthy ? '#F0FDF4' : isWatch ? '#FFFBEB' : '#FEF2F2',
            border: `1.5px solid ${isHealthy ? '#BBF7D0' : isWatch ? '#FDE68A' : '#FECACA'}`,
            borderRadius: '14px',
            padding: '0.85rem 1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.74rem', color: isHealthy ? '#15803D' : isWatch ? '#92400E' : '#991B1B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                🌾 Crop Health
              </span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '9999px',
                background: isHealthy ? '#DCFCE7' : isWatch ? '#FEF3C7' : '#FEE2E2',
                color: isHealthy ? '#15803D' : isWatch ? '#B45309' : '#B91C1C'
              }}>
                {isHealthy ? '🟢 Healthy' : isWatch ? '🟡 Watch' : '🔴 Needs Attention'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '2px 0 0.35rem 0' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                {healthScore}/100
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isHealthy ? '#15803D' : isWatch ? '#B45309' : '#B91C1C' }}>
                {isHealthy ? 'Crop is growing well' : isWatch ? 'Growth is moderate' : 'Vegetation stress detected'}
              </span>
            </div>

            {/* Technical NDVI secondary behind Details */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.4rem', fontSize: '0.72rem', color: '#64748B' }}>
              <span>Satellite Index: <strong>{satelliteData.ndviSummary.currentNdvi}</strong></span>
              <button
                onClick={() => setShowNdviDetails(!showNdviDetails)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#15803D',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showNdviDetails ? 'Hide details ▲' : 'Details →'}
              </button>
            </div>

            {showNdviDetails && (
              <div style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: '#475569', background: '#FFFFFF', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                NDVI measures canopy greenness from 0.0 to 1.0. A score of {satelliteData.ndviSummary.currentNdvi} indicates normal photosynthetic absorption.
              </div>
            )}
          </div>

          {/* Meaningful Visual Field Map */}
          <SatelliteMapCard
            field={satelliteData.field}
            currentNdvi={satelliteData.ndviSummary.currentNdvi}
            healthStatus={satelliteData.ndviSummary.healthStatus}
          />

          {/* Compact Month Trend Visualization (Mar ─ Apr ─ May ─ Jun) */}
          <NdviTimeSeriesChart observations={satelliteData.observations} />

          {/* Actionable Health Interpretation ("What this means" & "What you can do") */}
          <HealthInterpretationCard
            interpretation={satelliteData.interpretation}
            modelMetadata={satelliteData.modelMetadata}
          />
        </div>
      )}
    </BuildAiShell>
  );
};
