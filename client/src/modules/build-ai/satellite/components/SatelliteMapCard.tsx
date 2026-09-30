import React, { useState } from 'react';
import { SatelliteFieldSummary, FieldZoneDetail } from '../satellite.types.js';
import { useLanguage } from '../../../../context/LanguageContext.js';

interface SatelliteMapCardProps {
  field: SatelliteFieldSummary;
  currentNdvi: number;
  healthStatus: string;
  zones?: FieldZoneDetail[];
}

export const SatelliteMapCard: React.FC<SatelliteMapCardProps> = ({
  field,
  currentNdvi,
  healthStatus,
  zones
}) => {
  const { t } = useLanguage();
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'truecolor' | 'moisture'>('ndvi');
  const [selectedZone, setSelectedZone] = useState<FieldZoneDetail | null>(
    zones && zones.length > 0 ? zones.find(z => z.status === 'Needs attention') || zones[0] : null
  );

  // Default deterministic field zones if not passed from server/service
  const fieldZones: FieldZoneDetail[] = zones && zones.length > 0 ? zones : [
    {
      id: 'zone_nw',
      name: 'North-West Zone',
      ndvi: 0.74,
      vegetation: 'Healthy',
      status: 'Good',
      color: '#16A34A',
      description: 'Healthy, dense vegetative canopy.',
      moisturePercent: 78
    },
    {
      id: 'zone_ne',
      name: 'North-East Zone',
      ndvi: 0.72,
      vegetation: 'Healthy',
      status: 'Good',
      color: '#16A34A',
      description: 'Normal photosynthesis & nitrogen uptake.',
      moisturePercent: 74
    },
    {
      id: 'zone_sw',
      name: 'South-West Zone',
      ndvi: 0.58,
      vegetation: 'Moderate',
      status: 'Watch',
      color: '#D97706',
      description: 'Moderate crop vigor.',
      moisturePercent: 62
    },
    {
      id: 'zone_se',
      name: 'South-East Zone',
      ndvi: 0.28,
      vegetation: 'Stressed',
      status: 'Needs attention',
      color: '#DC2626',
      description: 'Vegetation stress detected. Possible moisture or nutrient issue.',
      moisturePercent: 34
    }
  ];

  const currentZone = selectedZone || fieldZones[fieldZones.length - 1];

  // Helper color for moisture layer
  const getMoistureColor = (pct: number) => {
    if (pct >= 70) return '#0284C7';
    if (pct >= 50) return '#0EA5E9';
    return '#E0F2FE';
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '14px',
      padding: '0.85rem 1rem',
      border: '1.5px solid #EFEAE2',
      boxShadow: '0 1px 3px rgba(180, 83, 9, 0.03)',
      marginBottom: '0.75rem'
    }}>
      {/* Header & Satellite Layer Switching Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.4rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.94rem', color: '#0F172A', fontWeight: 900 }}>
              🛰️ {t('buildAi.satellite.previewTitle')}
            </h3>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              background: '#FEF3C7',
              color: '#92400E',
              padding: '1px 5px',
              borderRadius: '4px'
            }}>
              {t('buildAi.demoDataBadge')}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B' }}>
            {t('buildAi.satellite.tapInstruction')}
          </p>
        </div>

        {/* Compact Layer Switcher: [ NDVI Heatmap ] [ True Color ] [ Moisture ] */}
        <div style={{ display: 'flex', background: '#F1F5F9', padding: '2px', borderRadius: '8px', gap: '2px', border: '1px solid #E2E8F0' }}>
          <button
            onClick={() => setActiveLayer('ndvi')}
            style={{
              padding: '3px 8px',
              fontSize: '0.72rem',
              fontWeight: 800,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: activeLayer === 'ndvi' ? '#FFFFFF' : 'transparent',
              color: activeLayer === 'ndvi' ? '#15803D' : '#64748B',
              boxShadow: activeLayer === 'ndvi' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            {t('buildAi.satellite.tabNdvi')}
          </button>
          <button
            onClick={() => setActiveLayer('truecolor')}
            style={{
              padding: '3px 8px',
              fontSize: '0.72rem',
              fontWeight: 800,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: activeLayer === 'truecolor' ? '#FFFFFF' : 'transparent',
              color: activeLayer === 'truecolor' ? '#15803D' : '#64748B',
              boxShadow: activeLayer === 'truecolor' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            {t('buildAi.satellite.tabTrueColor')}
          </button>
          <button
            onClick={() => setActiveLayer('moisture')}
            style={{
              padding: '3px 8px',
              fontSize: '0.72rem',
              fontWeight: 800,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: activeLayer === 'moisture' ? '#FFFFFF' : 'transparent',
              color: activeLayer === 'moisture' ? '#0369A1' : '#64748B',
              boxShadow: activeLayer === 'moisture' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            {t('buildAi.satellite.tabMoisture')}
          </button>
        </div>
      </div>

      {/* Main Interactive Satellite View (Realistic Field Treatment) */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '190px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: activeLayer === 'truecolor'
          ? 'radial-gradient(circle, #2d5a27 0%, #153313 100%)'
          : '#0F172A',
        border: '1.5px solid #CBD5E1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '0.75rem',
        boxSizing: 'border-box'
      }}>
        {/* Subtle Satellite Analysis Grid Pattern Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          pointerEvents: 'none'
        }} />

        {/* Top Info Bar on Canvas */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#F8FAFC',
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            🛰️ {field.field_name} • 10m Sentinel-2B
          </span>

          <span style={{
            background: activeLayer === 'ndvi' ? 'rgba(22, 163, 74, 0.85)' : activeLayer === 'moisture' ? 'rgba(2, 132, 199, 0.85)' : 'rgba(51, 65, 85, 0.85)',
            color: '#FFFFFF',
            fontSize: '0.66rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            {activeLayer === 'ndvi' ? t('buildAi.satellite.modeNdvi') : activeLayer === 'moisture' ? t('buildAi.satellite.modeMoisture') : t('buildAi.satellite.modeTrueColor')}
          </span>
        </div>

        {/* Interactive Field Vegetation Health Zones Grid */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          margin: '0.75rem auto',
          maxWidth: '300px',
          width: '100%'
        }}>
          {fieldZones.map((zone) => {
            const isSelected = currentZone?.id === zone.id;
            const zoneBg = activeLayer === 'moisture'
              ? getMoistureColor(zone.moisturePercent)
              : activeLayer === 'truecolor'
              ? zone.status === 'Needs attention' ? '#5A6340' : '#3F6E35'
              : zone.color;

            return (
              <div
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                style={{
                  background: zoneBg,
                  borderRadius: '10px',
                  padding: '0.65rem 0.6rem',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  border: isSelected ? '3px solid #FFFFFF' : '1px solid rgba(255,255,255,0.25)',
                  boxShadow: isSelected ? '0 0 12px rgba(255,255,255,0.5)' : '0 2px 4px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '62px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {zone.name.replace(' Zone', '')}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 900,
                    background: 'rgba(0,0,0,0.4)',
                    padding: '1px 5px',
                    borderRadius: '4px'
                  }}>
                    {zone.status === 'Good' ? '🟢' : zone.status === 'Watch' ? '🟡' : '🔴'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 900 }}>
                    {activeLayer === 'moisture' ? `${zone.moisturePercent}%` : zone.ndvi}
                  </span>
                  <span style={{ fontSize: '0.66rem', opacity: 0.9, fontWeight: 700 }}>
                    {zone.vegetation}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend bar: Green = Healthy, Yellow = Watch, Red = Stressed */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(3px)',
          borderRadius: '8px',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
              <span>{t('buildAi.satellite.zoneLegendHealthy')}</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D97706', display: 'inline-block' }} />
              <span>{t('buildAi.satellite.zoneLegendWatch')}</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626', display: 'inline-block' }} />
              <span>{t('buildAi.satellite.zoneLegendStressed')}</span>
            </span>
          </div>

          <span style={{ color: '#86EFAC', fontWeight: 700 }}>
            {selectedZone ? `${selectedZone.name}` : t('buildAi.satellite.tapInstruction')}
          </span>
        </div>
      </div>

      {/* Selected Zone Inspection Card (Answers: "This part of the field has a problem") */}
      {currentZone && (
        <div style={{
          marginTop: '0.65rem',
          background: currentZone.status === 'Needs attention' ? '#FEF2F2' : currentZone.status === 'Watch' ? '#FFFBEB' : '#F0FDF4',
          border: `1.5px solid ${currentZone.status === 'Needs attention' ? '#FECACA' : currentZone.status === 'Watch' ? '#FDE68A' : '#BBF7D0'}`,
          borderRadius: '10px',
          padding: '0.65rem 0.85rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: currentZone.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t('buildAi.satellite.zoneSelectedTitle')}
            </div>
            <div style={{ fontSize: '0.94rem', fontWeight: 900, color: '#0F172A', marginTop: '1px' }}>
              {currentZone.name}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px' }}>
              {currentZone.description}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 700 }}>{t('buildAi.satellite.zoneNdviLabel')}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: currentZone.color, lineHeight: 1 }}>
              {currentZone.ndvi}
            </div>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              marginTop: '3px',
              color: currentZone.color
            }}>
              {currentZone.status === 'Needs attention' ? t('buildAi.needsCare') : currentZone.status === 'Watch' ? t('buildAi.moderate') : t('buildAi.good')}
            </div>
          </div>
        </div>
      )}

      {/* Section 5: NDVI Continuous Scale Bar */}
      <div style={{ marginTop: '0.65rem', padding: '0.45rem 0.65rem', background: '#FDFBF7', borderRadius: '8px', border: '1px solid #EFEAE2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#475569', fontWeight: 700, marginBottom: '3px' }}>
          <span>{t('buildAi.satellite.scaleLow')} (0.0)</span>
          <span style={{ color: '#0F172A', fontWeight: 800 }}>NDVI</span>
          <span>{t('buildAi.satellite.scaleHealthy')} (1.0)</span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          borderRadius: '4px',
          background: 'linear-gradient(to right, #DC2626 0%, #EA580C 25%, #EAB308 50%, #84CC16 75%, #16A34A 100%)',
          position: 'relative'
        }}>
          {/* Indicator pin for current field NDVI */}
          <div style={{
            position: 'absolute',
            top: '-3px',
            left: `${Math.min(96, Math.max(4, currentNdvi * 100))}%`,
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '2.5px solid #0F172A',
            transform: 'translateX(-50%)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }} />
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.68rem', color: '#64748B', marginTop: '4px', fontWeight: 600 }}>
          {t('buildAi.ndviScore')}: <strong>{currentNdvi}</strong> ({healthStatus === 'GOOD' ? t('buildAi.good') : healthStatus === 'STRESSED' ? t('buildAi.needsCare') : t('buildAi.moderate')})
        </div>
      </div>
    </div>
  );
};
