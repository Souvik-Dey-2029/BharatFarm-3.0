import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { satelliteClientService } from '../satellite.service.js';
import { SatelliteFieldData, SatelliteFieldSummary } from '../satellite.types.js';
import { SatelliteMapCard } from '../components/SatelliteMapCard.js';
import { NdviTimeSeriesChart } from '../components/NdviTimeSeriesChart.js';
import { HealthInterpretationCard } from '../components/HealthInterpretationCard.js';
import { BuildAiShell } from '../../components/BuildAiShell.js';

export const SatellitePage: React.FC = () => {
  const navigate = useNavigate();

  const [availableFields, setAvailableFields] = useState<SatelliteFieldSummary[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('field_demo_paddy_01');

  const [satelliteData, setSatelliteData] = useState<SatelliteFieldData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load available fields on mount
  useEffect(() => {
    let isMounted = true;
    satelliteClientService.getAvailableFields().then(fields => {
      if (isMounted && fields.length > 0) {
        const formatted: SatelliteFieldSummary[] = fields.map(f => ({
          id: f.id,
          field_name: f.field_name,
          crop_name: f.crop_name,
          area_acres: f.area_acres,
          centroid_lat: f.centroid_lat || 22.0667,
          centroid_lng: f.centroid_lng || 88.0667,
          boundary_coordinates: f.boundary_coordinates || []
        }));
        setAvailableFields(formatted);
        setSelectedFieldId(fields[0].id);
      }
    });

    return () => { isMounted = false; };
  }, []);

  // Fetch telemetry when selected field changes
  const loadSatelliteData = async (fieldId: string) => {
    setIsLoading(true);
    setError(null);

    const res = await satelliteClientService.getSatelliteData(fieldId);
    setIsLoading(false);

    if (res.success && res.data) {
      setSatelliteData(res.data);
    } else {
      setError(typeof res.error === 'string' ? res.error : res.error?.message || 'Failed to load satellite telemetry data.');
    }
  };

  useEffect(() => {
    if (selectedFieldId) {
      loadSatelliteData(selectedFieldId);
    }
  }, [selectedFieldId]);

  return (
    <BuildAiShell activeRoute="/build-ai/satellite">
      {/* Header & Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="material-symbols-outlined" style={{ color: '#16A34A', fontSize: '24px' }}>satellite_alt</span>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Satellite Data Integration
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
            Field-level vegetation health (NDVI) & 10m Sentinel-2 satellite observation map
          </p>
        </div>

        {/* Source Badge (Live vs Demo) */}
        {satelliteData && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '5px 14px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            background: satelliteData.source === 'live' ? '#DCFCE7' : '#FEF3C7',
            color: satelliteData.source === 'live' ? '#15803D' : '#B45309',
            border: `1px solid ${satelliteData.source === 'live' ? '#BBF7D0' : '#FDE68A'}`
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: satelliteData.source === 'live' ? '#16A34A' : '#D97706'
            }} />
            <span>{satelliteData.source === 'live' ? 'LIVE SATELLITE TELEMETRY' : 'DEMO DATASET'}</span>
          </div>
        )}
      </div>

      {/* Field Selector Bar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        border: '1px solid #E2E8F0',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: '#F0FDF4',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>grass</span>
          </div>
          <div>
            <label htmlFor="field-select" style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', fontWeight: 700, marginBottom: '0.15rem' }}>
              Select Farm Field:
            </label>
            <select
              id="field-select"
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(e.target.value)}
              style={{
                background: '#F8FAFC',
                color: '#0F172A',
                border: '1.5px solid #E2E8F0',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.9rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer',
                minWidth: '240px'
              }}
            >
              {availableFields.map(f => (
                <option key={f.id} value={f.id}>
                  {f.field_name} ({f.crop_name} • {f.area_acres} ac)
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => navigate('/sih/field-mapping')}
          style={{
            padding: '0.5rem 1rem',
            background: '#F0FDF4',
            color: '#15803D',
            border: '1px solid #BBF7D0',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_location_alt</span>
          <span>Map New Field</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div className="spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛰️</div>
          <p style={{ margin: 0, fontWeight: 700, color: '#334155' }}>
            Retrieving Sentinel-2 Multispectral Satellite Data...
          </p>
        </div>
      )}

      {/* Error Card */}
      {error && !isLoading && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: '14px',
          padding: '1.25rem',
          color: '#991B1B',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Satellite Telemetry Error</div>
            <div style={{ fontSize: '0.85rem' }}>{error}</div>
          </div>
          <button
            onClick={() => loadSatelliteData(selectedFieldId)}
            style={{
              padding: '0.45rem 0.9rem',
              background: '#EF4444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Retry Satellite Stream
          </button>
        </div>
      )}

      {/* Content Grid */}
      {!isLoading && !error && satelliteData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Row: Key Metrics & Map */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Map Card */}
            <SatelliteMapCard
              field={satelliteData.field}
              currentNdvi={satelliteData.ndviSummary.currentNdvi}
              healthStatus={satelliteData.ndviSummary.healthStatus}
            />

            {/* Time Series Chart Card */}
            <NdviTimeSeriesChart
              observations={satelliteData.observations}
            />
          </div>

          {/* Health Interpretation & Recommendations */}
          <HealthInterpretationCard
            interpretation={satelliteData.interpretation}
            modelMetadata={satelliteData.modelMetadata}
          />
        </div>
      )}
    </BuildAiShell>
  );
};
