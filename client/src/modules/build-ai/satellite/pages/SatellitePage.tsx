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

  const selectedField = availableFields.find(f => f.id === selectedFieldId);

  return (
    <BuildAiShell activeRoute="/build-ai/satellite" pageTitle="Satellite Health">
      {/* Field Selector & Telemetry Status Bar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '1rem',
        border: '1px solid #E2E8F0',
        marginBottom: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: '1 1 240px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '9px',
            background: '#F0FDF4',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>grass</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <label htmlFor="field-select" style={{ display: 'block', fontSize: '0.7rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.15rem' }}>
              Selected Field
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
                padding: '0.35rem 0.65rem',
                fontSize: '0.86rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer',
                maxWidth: '100%'
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

        {/* Source Badge (Live vs Demo) */}
        {satelliteData && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 800,
            background: satelliteData.source === 'live' ? '#DCFCE7' : '#FEF3C7',
            color: satelliteData.source === 'live' ? '#15803D' : '#B45309',
            border: `1px solid ${satelliteData.source === 'live' ? '#BBF7D0' : '#FDE68A'}`
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: satelliteData.source === 'live' ? '#16A34A' : '#D97706'
            }} />
            <span>{satelliteData.source === 'live' ? 'LIVE SATELLITE DATA' : 'DEMO SATELLITE DATA'}</span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛰️</div>
          <p style={{ margin: 0, fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>
            Retrieving Sentinel-2 satellite observation...
          </p>
        </div>
      )}

      {/* Error Card */}
      {error && !isLoading && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '12px',
          padding: '1rem',
          color: '#991B1B',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Satellite Telemetry Error</div>
            <div style={{ fontSize: '0.8rem' }}>{error}</div>
          </div>
          <button
            onClick={() => loadSatelliteData(selectedFieldId)}
            style={{
              padding: '0.4rem 0.8rem',
              background: '#DC2626',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Retry Stream
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      {!isLoading && !error && satelliteData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Main Health Insight Card (Answer: How healthy is my crop?) */}
          <div style={{
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            border: '1.5px solid #BBF7D0',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Vegetation Status
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>
                {satelliteData.ndviSummary.healthStatus}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                Trend: <strong>{satelliteData.ndviSummary.trend}</strong> • Last observed: {satelliteData.ndviSummary.lastObservationDate}
              </div>
            </div>

            <div style={{
              background: '#FFFFFF',
              border: '1px solid #BBF7D0',
              borderRadius: '10px',
              padding: '0.5rem 1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>Current NDVI</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#16A34A' }}>
                {satelliteData.ndviSummary.currentNdvi}
              </div>
            </div>
          </div>

          {/* Time Series Trend Chart */}
          <NdviTimeSeriesChart observations={satelliteData.observations} />

          {/* Field Map */}
          <SatelliteMapCard
            field={satelliteData.field}
            currentNdvi={satelliteData.ndviSummary.currentNdvi}
            healthStatus={satelliteData.ndviSummary.healthStatus}
          />

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
