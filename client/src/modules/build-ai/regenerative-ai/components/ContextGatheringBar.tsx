import React from 'react';

interface ContextGatheringBarProps {
  hasSoilData: boolean;
  hasSatelliteData: boolean;
  onToggleSoil: () => void;
  onToggleSatellite: () => void;
}

export const ContextGatheringBar: React.FC<ContextGatheringBarProps> = ({
  hasSoilData,
  hasSatelliteData,
  onToggleSoil,
  onToggleSatellite
}) => {
  return (
    <div style={{
      background: 'var(--surface-card, #12281a)',
      borderRadius: '16px',
      padding: '1rem 1.25rem',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      marginBottom: '1.25rem'
    }}>
      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span>🔗 Multi-Source Agricultural Intelligence Ingestion Pipeline:</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.75rem'
      }}>
        {/* Weather Item */}
        <div style={{
          background: 'rgba(52, 211, 153, 0.12)',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          borderRadius: '10px',
          padding: '0.6rem 0.75rem',
          fontSize: '0.78rem'
        }}>
          <div style={{ color: '#4ADE80', fontWeight: 700 }}>🌤️ Local Climate</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: '2px', fontSize: '0.72rem' }}>Connected • Realtime</div>
        </div>

        {/* Soil Item */}
        <div
          onClick={onToggleSoil}
          style={{
            background: hasSoilData ? 'rgba(52, 211, 153, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${hasSoilData ? 'rgba(52, 211, 153, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            borderRadius: '10px',
            padding: '0.6rem 0.75rem',
            fontSize: '0.78rem',
            cursor: 'pointer'
          }}
          title="Click to toggle Soil Data inclusion"
        >
          <div style={{ color: hasSoilData ? '#4ADE80' : '#FBBF24', fontWeight: 700 }}>🧪 Soil Health Lab</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: '2px', fontSize: '0.72rem' }}>
            {hasSoilData ? 'Connected • Lab Values' : 'Missing (Click to add)'}
          </div>
        </div>

        {/* Satellite Item */}
        <div
          onClick={onToggleSatellite}
          style={{
            background: hasSatelliteData ? 'rgba(52, 211, 153, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${hasSatelliteData ? 'rgba(52, 211, 153, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            borderRadius: '10px',
            padding: '0.6rem 0.75rem',
            fontSize: '0.78rem',
            cursor: 'pointer'
          }}
          title="Click to toggle Satellite Telemetry inclusion"
        >
          <div style={{ color: hasSatelliteData ? '#4ADE80' : '#FBBF24', fontWeight: 700 }}>🛰️ Satellite NDVI</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: '2px', fontSize: '0.72rem' }}>
            {hasSatelliteData ? 'Connected • Sentinel-2' : 'Missing (Click to add)'}
          </div>
        </div>

        {/* Crop Context Item */}
        <div style={{
          background: 'rgba(52, 211, 153, 0.12)',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          borderRadius: '10px',
          padding: '0.6rem 0.75rem',
          fontSize: '0.78rem'
        }}>
          <div style={{ color: '#4ADE80', fontWeight: 700 }}>🌾 Field & Crop Profile</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: '2px', fontSize: '0.72rem' }}>Connected • Sowing Date</div>
        </div>
      </div>
    </div>
  );
};
