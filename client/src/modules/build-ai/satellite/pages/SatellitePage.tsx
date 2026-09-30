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
  const { fields, selectedFieldId, selectedField, setSelectedFieldId, isLoadingFields } = useSharedField();

  const [satelliteData, setSatelliteData] = useState<SatelliteFieldData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <BuildAiShell activeRoute="/build-ai/satellite" pageTitle={t('buildAi.cropHealth')}>
      {/* Field Selector & Source Pill */}
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

        {/* Live vs Demo Telemetry Badge */}
        {satelliteData && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '3px 8px',
            borderRadius: '9999px',
            fontSize: '0.68rem',
            fontWeight: 800,
            background: satelliteData.source === 'live' ? '#DCFCE7' : '#FEF3C7',
            color: satelliteData.source === 'live' ? '#15803D' : '#B45309',
            border: `1px solid ${satelliteData.source === 'live' ? '#BBF7D0' : '#FDE68A'}`
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: satelliteData.source === 'live' ? '#16A34A' : '#D97706'
            }} />
            <span>{satelliteData.source === 'live' ? t('buildAi.liveDataBadge') : t('buildAi.demoDataBadge')}</span>
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
          {/* Answer Farmer Question: "Is my crop healthy?" */}
          {/* 2 SIDE-BY-SIDE CARDS (NO LONG VERTICAL SCROLL) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.65rem'
          }}>
            {/* Card 1: 🌿 Crop Health */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #BBF7D0',
              borderRadius: '14px',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  🌿 {t('buildAi.cropHealth')}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', marginTop: '2px', lineHeight: 1.2 }}>
                  {satelliteData.ndviSummary.healthStatus === 'EXCELLENT' || satelliteData.ndviSummary.healthStatus === 'HEALTHY'
                    ? t('buildAi.healthy')
                    : satelliteData.ndviSummary.healthStatus === 'MODERATE'
                    ? t('buildAi.moderate')
                    : t('buildAi.stressed')}
                </div>
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: '#15803D',
                fontWeight: 700,
                marginTop: '0.4rem',
                background: '#F0FDF4',
                padding: '2px 6px',
                borderRadius: '6px',
                alignSelf: 'flex-start'
              }}>
                ✓ {t('buildAi.lookingGood')}
              </div>
            </div>

            {/* Card 2: 📊 NDVI Score */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #BAE6FD',
              borderRadius: '14px',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#0369A1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  📊 {t('buildAi.ndviScore')}
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#16A34A', marginTop: '2px', lineHeight: 1.2 }}>
                  {satelliteData.ndviSummary.currentNdvi}
                </div>
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: '#0369A1',
                fontWeight: 700,
                marginTop: '0.4rem',
                background: '#F0F9FF',
                padding: '2px 6px',
                borderRadius: '6px',
                alignSelf: 'flex-start'
              }}>
                {t('buildAi.normalRange')}
              </div>
            </div>
          </div>

          {/* Bi-Weekly NDVI Trend Chart */}
          <NdviTimeSeriesChart observations={satelliteData.observations} />

          {/* Field Boundary & Satellite Map */}
          <SatelliteMapCard
            field={satelliteData.field}
            currentNdvi={satelliteData.ndviSummary.currentNdvi}
            healthStatus={satelliteData.ndviSummary.healthStatus}
          />

          {/* Actionable Health Interpretation */}
          <HealthInterpretationCard
            interpretation={satelliteData.interpretation}
            modelMetadata={satelliteData.modelMetadata}
          />
        </div>
      )}
    </BuildAiShell>
  );
};
