import React, { useState } from 'react';
import { SatelliteFieldSummary } from '../satellite.types.js';

interface SatelliteMapCardProps {
  field: SatelliteFieldSummary;
  currentNdvi: number;
  healthStatus: string;
}

export const SatelliteMapCard: React.FC<SatelliteMapCardProps> = ({ field, currentNdvi, healthStatus }) => {
  const [mapLayer, setMapLayer] = useState<'health' | 'truecolor' | 'moisture'>('health');
  const [showCoords, setShowCoords] = useState<boolean>(false);

  // Convert lat/lng boundary coordinates into SVG viewbox points
  const coords = field.boundary_coordinates || [];
  const minLat = Math.min(...coords.map((c: { lat: number; lng: number }) => c.lat), field.centroid_lat - 0.002);
  const maxLat = Math.max(...coords.map((c: { lat: number; lng: number }) => c.lat), field.centroid_lat + 0.002);
  const minLng = Math.min(...coords.map((c: { lat: number; lng: number }) => c.lng), field.centroid_lng - 0.002);
  const maxLng = Math.max(...coords.map((c: { lat: number; lng: number }) => c.lng), field.centroid_lng + 0.002);

  const width = 360;
  const height = 190;

  const pointsString = coords
    .map((c: { lat: number; lng: number }) => {
      const x = ((c.lng - minLng) / (maxLng - minLng || 0.0001)) * (width - 60) + 30;
      const y = height - (((c.lat - minLat) / (maxLat - minLat || 0.0001)) * (height - 50) + 25);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Field Health Colors: Green = Healthy, Yellow = Watch, Red = Stressed
  const getFieldHealthStatus = () => {
    if (currentNdvi >= 0.65) return { status: 'Healthy', color: '#16A34A', bgFill: 'rgba(22, 163, 74, 0.45)', stroke: '#15803D' };
    if (currentNdvi >= 0.45) return { status: 'Watch', color: '#D97706', bgFill: 'rgba(217, 119, 6, 0.45)', stroke: '#B45309' };
    return { status: 'Stressed', color: '#DC2626', bgFill: 'rgba(220, 38, 38, 0.50)', stroke: '#B91C1C' };
  };

  const healthVisual = getFieldHealthStatus();

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '14px',
      padding: '0.85rem 1rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      marginBottom: '0.75rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.4rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '0.94rem', color: '#0F172A', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>🗺️ Field Health Map</span>
          </h3>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B' }}>
            {field.field_name} • {field.crop_name} ({field.area_acres} Acres)
          </p>
        </div>

        {/* Simplified View Switcher */}
        <div style={{ display: 'flex', background: '#F1F5F9', padding: '2px', borderRadius: '8px', gap: '2px', border: '1px solid #E2E8F0' }}>
          <button
            onClick={() => setMapLayer('health')}
            style={{
              padding: '3px 8px',
              fontSize: '0.72rem',
              fontWeight: 800,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: mapLayer === 'health' ? '#FFFFFF' : 'transparent',
              color: mapLayer === 'health' ? '#15803D' : '#64748B',
              boxShadow: mapLayer === 'health' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            Health Map
          </button>
          <button
            onClick={() => setMapLayer('moisture')}
            style={{
              padding: '3px 8px',
              fontSize: '0.72rem',
              fontWeight: 800,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: mapLayer === 'moisture' ? '#FFFFFF' : 'transparent',
              color: mapLayer === 'moisture' ? '#0369A1' : '#64748B',
              boxShadow: mapLayer === 'moisture' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            Water Level
          </button>
        </div>
      </div>

      {/* SVG Canvas Field Map with Health Overlay */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        borderRadius: '10px',
        overflow: 'hidden',
        background: 'radial-gradient(circle, #0e2717 0%, #06130b 100%)',
        border: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <defs>
            <pattern id="fieldGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fieldGrid)" />

          {/* Polygon Boundary */}
          {coords.length >= 3 ? (
            <g>
              <polygon
                points={pointsString}
                fill={mapLayer === 'moisture' ? 'rgba(14, 165, 233, 0.45)' : healthVisual.bgFill}
                stroke={mapLayer === 'moisture' ? '#0284C7' : healthVisual.stroke}
                strokeWidth="3"
              />
              <circle
                cx={width / 2}
                cy={height / 2}
                r="5"
                fill="#F59E0B"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          ) : (
            <g>
              <rect
                x="40"
                y="25"
                width={width - 80}
                height={height - 50}
                rx="12"
                fill={mapLayer === 'moisture' ? 'rgba(14, 165, 233, 0.45)' : healthVisual.bgFill}
                stroke={mapLayer === 'moisture' ? '#0284C7' : healthVisual.stroke}
                strokeWidth="3"
              />
              <circle
                cx={width / 2}
                cy={height / 2}
                r="5"
                fill="#F59E0B"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Practical Field Health Legend at Bottom */}
        <div style={{
          position: 'absolute',
          bottom: '6px',
          left: '6px',
          right: '6px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(3px)',
          padding: '4px 8px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '4px',
          fontSize: '0.68rem',
          color: '#FFFFFF'
        }}>
          {/* Meaningful visual legend: Green = Healthy, Yellow = Watch, Red = Stressed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
              <span>Healthy</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D97706', display: 'inline-block' }} />
              <span>Watch</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626', display: 'inline-block' }} />
              <span>Stressed</span>
            </span>
          </div>

          <span style={{ color: '#86EFAC', fontWeight: 700 }}>
            {mapLayer === 'moisture' ? '💧 Water Index' : `🌿 Field: ${healthVisual.status}`}
          </span>
        </div>
      </div>

      {/* Collapsible Coordinates & Resolution Details */}
      <div style={{ marginTop: '0.45rem', textAlign: 'right' }}>
        <button
          onClick={() => setShowCoords(!showCoords)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748B',
            fontSize: '0.7rem',
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0
          }}
        >
          {showCoords ? 'Hide Field Coordinates ▲' : 'View Field Coordinates & Satellite Info ▼'}
        </button>
        {showCoords && (
          <div style={{
            fontSize: '0.68rem',
            color: '#64748B',
            marginTop: '0.35rem',
            background: '#F8FAFC',
            padding: '0.4rem 0.6rem',
            borderRadius: '6px',
            textAlign: 'left',
            border: '1px solid #E2E8F0'
          }}>
            <div><strong>Center:</strong> {field.centroid_lat.toFixed(4)}°N, {field.centroid_lng.toFixed(4)}°E</div>
            <div><strong>Imagery:</strong> 10-meter Sentinel-2B Copernicus constellation</div>
          </div>
        )}
      </div>
    </div>
  );
};
