import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { satelliteClientService } from '../satellite.service.js';
import { SatelliteFieldData } from '../../types.js';
import { SatelliteMapCard } from '../components/SatelliteMapCard.js';
import { NdviTimeSeriesChart } from '../components/NdviTimeSeriesChart.js';
import { HealthInterpretationCard } from '../components/HealthInterpretationCard.js';

export const SatellitePage: React.FC = () => {
  const navigate = useNavigate();

  const [availableFields, setAvailableFields] = useState<Array<{ id: string; field_name: string; crop_name: string; area_acres: number; centroid_lat?: number; centroid_lng?: number; boundary_coordinates?: Array<{ lat: number; lng: number }> }>>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('field_demo_paddy_01');
  const [satelliteData, setSatelliteData] = useState<SatelliteFieldData | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load available fields on mount
  useEffect(() => {
    let isMounted = true;
    satelliteClientService.getAvailableFields().then(fields => {
      if (isMounted && fields.length > 0) {
        setAvailableFields(fields);
        setSelectedFieldId(fields[0].id);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Fetch satellite data whenever selectedFieldId changes
  const loadSatelliteData = async (fieldId: string) => {
    setIsLoading(true);
    setError(null);

    const selectedMeta = availableFields.find(f => f.id === fieldId);
    const res = await satelliteClientService.getSatelliteData(fieldId, selectedMeta);

    if (res.success && res.data) {
      setSatelliteData(res.data);
    } else {
      setError(res.error?.message || 'Failed to load satellite telemetry data.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedFieldId) {
      loadSatelliteData(selectedFieldId);
    }
  }, [selectedFieldId]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface-bg, #0b1d12)',
      color: 'var(--text-primary, #ffffff)',
      padding: '1rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header Navigation & Source Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/build-ai')}
            style={{
              padding: '0.5rem 0.85rem',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            ← Back to Build with AI
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              📡 Satellite Data Integration
            </h1>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
              Field-level NDVI & vegetation health monitoring
            </p>
          </div>
        </div>

        {/* Source Badge (Live vs Demo) */}
        {satelliteData && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700,
            background: satelliteData.source === 'live' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            color: satelliteData.source === 'live' ? '#4ADE80' : '#FBBF24',
            border: `1px solid ${satelliteData.source === 'live' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: satelliteData.source === 'live' ? '#22C55E' : '#F59E0B'
            }}></span>
            <span>{satelliteData.source === 'live' ? 'LIVE SATELLITE API' : 'DEMO DATASET'}</span>
          </div>
        )}
      </div>

      {/* Field Selector */}
      <div style={{
        background: 'var(--surface-card, #12281a)',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🌾</span>
          <div>
            <label htmlFor="field-select" style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
              Select Registered Farm Field:
            </label>
            <select
              id="field-select"
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.4)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
                minWidth: '220px'
              }}
            >
              {availableFields.map(f => (
                <option key={f.id} value={f.id} style={{ background: '#0d1f14', color: '#fff' }}>
                  {f.field_name} ({f.crop_name} • {f.area_acres} ac)
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => navigate('/sih/field-mapping')}
          style={{
            padding: '0.45rem 0.85rem',
            background: 'rgba(34, 197, 94, 0.15)',
            color: '#4ADE80',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          + Map New Field
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div style={{
          background: 'var(--surface-card, #12281a)',
          borderRadius: '16px',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div className="spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛰️</div>
          <p style={{ margin: 0, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
            Retrieving Sentinel-2 Multispectral Satellite Data...
          </p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
            Processing NDVI vegetation index & cloud masking
          </p>
        </div>
      )}

      {/* Error State with Retry */}
      {!isLoading && error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          color: '#FCA5A5'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Failed to Fetch Satellite Data</h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{error}</p>
          <button
            onClick={() => loadSatelliteData(selectedFieldId)}
            style={{
              padding: '0.5rem 1.25rem',
              background: '#EF4444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🔄 Retry Satellite Request
          </button>
        </div>
      )}

      {/* Satellite Data Content */}
      {!isLoading && !error && satelliteData && (
        <div>
          {/* Hero Metric Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            {/* NDVI Current Score */}
            <div style={{
              background: 'var(--surface-card, #12281a)',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '0.25rem' }}>
                Current NDVI Index
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#34D399', letterSpacing: '-0.03em' }}>
                  {satelliteData.ndviSummary.currentNdvi}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: satelliteData.ndviSummary.changePercentage >= 0 ? '#4ADE80' : '#F87171',
                  background: satelliteData.ndviSummary.changePercentage >= 0 ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  {satelliteData.ndviSummary.changePercentage >= 0 ? '+' : ''}{satelliteData.ndviSummary.changePercentage}%
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
                Last pass: {satelliteData.ndviSummary.lastObservationDate}
              </div>
            </div>

            {/* Health Status */}
            <div style={{
              background: 'var(--surface-card, #12281a)',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '0.25rem' }}>
                Vegetation Health Status
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ADE80', letterSpacing: '-0.02em' }}>
                {satelliteData.ndviSummary.healthStatus}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
                Trend: {satelliteData.ndviSummary.trend} growth curve
              </div>
            </div>

            {/* Crop Info */}
            <div style={{
              background: 'var(--surface-card, #12281a)',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '0.25rem' }}>
                Field & Area Profile
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                {satelliteData.field.crop_name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
                {satelliteData.field.area_acres} Acres • {satelliteData.field.location_address || 'Monitored Parcel'}
              </div>
            </div>
          </div>

          {/* Map View */}
          <SatelliteMapCard
            field={satelliteData.field}
            currentNdvi={satelliteData.ndviSummary.currentNdvi}
            healthStatus={satelliteData.ndviSummary.healthStatus}
          />

          {/* Time Series Chart */}
          <NdviTimeSeriesChart observations={satelliteData.observations} />

          {/* Health Interpretation & Model Card */}
          <HealthInterpretationCard
            interpretation={satelliteData.interpretation}
            modelMetadata={satelliteData.modelMetadata}
          />
        </div>
      )}
    </div>
  );
};
