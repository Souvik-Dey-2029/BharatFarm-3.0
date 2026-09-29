import React, { useState } from 'react';
import { SatelliteFieldSummary } from '../satellite.types.js';

interface SatelliteMapCardProps {
  field: SatelliteFieldSummary;
  currentNdvi: number;
  healthStatus: string;
}

export const SatelliteMapCard: React.FC<SatelliteMapCardProps> = ({ field, currentNdvi, healthStatus }) => {
  const [mapLayer, setMapLayer] = useState<'ndvi' | 'truecolor' | 'moisture'>('ndvi');

  // Convert lat/lng boundary coordinates into SVG viewbox points
  const coords = field.boundary_coordinates || [];
  const minLat = Math.min(...coords.map((c: { lat: number; lng: number }) => c.lat), field.centroid_lat - 0.002);
  const maxLat = Math.max(...coords.map((c: { lat: number; lng: number }) => c.lat), field.centroid_lat + 0.002);
  const minLng = Math.min(...coords.map((c: { lat: number; lng: number }) => c.lng), field.centroid_lng - 0.002);
  const maxLng = Math.max(...coords.map((c: { lat: number; lng: number }) => c.lng), field.centroid_lng + 0.002);

  const width = 360;
  const height = 220;

  const pointsString = coords
    .map((c: { lat: number; lng: number }) => {
      const x = ((c.lng - minLng) / (maxLng - minLng || 0.0001)) * (width - 60) + 30;
      const y = height - (((c.lat - minLat) / (maxLat - minLat || 0.0001)) * (height - 60) + 30);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const getHeatmapColor = () => {
    if (mapLayer === 'moisture') return 'rgba(14, 165, 233, 0.45)';
    if (mapLayer === 'truecolor') return 'rgba(34, 197, 94, 0.35)';
    if (currentNdvi >= 0.75) return 'rgba(34, 197, 94, 0.55)'; // Deep Green
    if (currentNdvi >= 0.60) return 'rgba(132, 204, 22, 0.55)'; // Light Green
    if (currentNdvi >= 0.45) return 'rgba(234, 179, 8, 0.55)'; // Yellow
    return 'rgba(239, 68, 68, 0.55)'; // Red
  };

  const getStrokeColor = () => {
    if (mapLayer === 'moisture') return '#0284C7';
    if (mapLayer === 'truecolor') return '#15803D';
    return '#16A34A';
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '1.25rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      marginBottom: '1.25rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F172A', fontWeight: 800 }}>
            🛰️ Field Boundary & Satellite Map
          </h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
            Centroid: {field.centroid_lat.toFixed(4)}°N, {field.centroid_lng.toFixed(4)}°E ({field.area_acres} Acres)
          </p>
        </div>

        {/* Map Layer Selector */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '10px', gap: '2px' }}>
          <button
            onClick={() => setMapLayer('ndvi')}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: mapLayer === 'ndvi' ? '#16A34A' : 'transparent',
              color: mapLayer === 'ndvi' ? '#fff' : 'rgba(255,255,255,0.6)'
            }}
          >
            NDVI Heatmap
          </button>
          <button
            onClick={() => setMapLayer('truecolor')}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: mapLayer === 'truecolor' ? '#16A34A' : 'transparent',
              color: mapLayer === 'truecolor' ? '#fff' : 'rgba(255,255,255,0.6)'
            }}
          >
            True Color
          </button>
          <button
            onClick={() => setMapLayer('moisture')}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: mapLayer === 'moisture' ? '#0284C7' : 'transparent',
              color: mapLayer === 'moisture' ? '#fff' : 'rgba(255,255,255,0.6)'
            }}
          >
            Moisture
          </button>
        </div>
      </div>

      {/* SVG Canvas Field Map */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        borderRadius: '12px',
        overflow: 'hidden',
        background: mapLayer === 'truecolor' 
          ? 'radial-gradient(circle, #1e3b26 0%, #0d1e13 100%)'
          : 'radial-gradient(circle, #0e2717 0%, #06130b 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Background Grid Pattern */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Polygon Boundary */}
          {coords.length >= 3 ? (
            <g>
              <polygon
                points={pointsString}
                fill={getHeatmapColor()}
                stroke={getStrokeColor()}
                strokeWidth="3"
                strokeDasharray={mapLayer === 'truecolor' ? 'none' : 'none'}
              />
              {/* Centroid Pin */}
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
                y="30"
                width={width - 80}
                height={height - 60}
                rx="16"
                fill={getHeatmapColor()}
                stroke={getStrokeColor()}
                strokeWidth="3"
              />
              <circle
                cx={width / 2}
                cy={height / 2}
                r="6"
                fill="#F59E0B"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Legend Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.9)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: getHeatmapColor(),
            display: 'inline-block'
          }}></span>
          <span>{mapLayer === 'ndvi' ? `NDVI: ${currentNdvi} (${healthStatus})` : mapLayer === 'moisture' ? 'NDWI Soil Moisture' : 'True Color RGB'}</span>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          background: 'rgba(0,0,0,0.65)',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '0.7rem',
          color: '#34D399',
          fontWeight: 600
        }}>
          10m Resolution • Sentinel-2B
        </div>
      </div>
    </div>
  );
};
