import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildAiShell } from '../components/BuildAiShell.js';
import { satelliteClientService } from '../satellite/satellite.service.js';

interface FieldContextSummary {
  id: string;
  field_name: string;
  crop_name: string;
  area_acres: number;
  centroid_lat?: number;
  centroid_lng?: number;
}

export const BuildAiLauncherPage: React.FC = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<FieldContextSummary[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [isLoadingFields, setIsLoadingFields] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    satelliteClientService.getAvailableFields().then(res => {
      if (isMounted) {
        setFields(res);
        if (res.length > 0) {
          setSelectedFieldId(res[0].id);
        }
        setIsLoadingFields(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoadingFields(false);
    });
    return () => { isMounted = false; };
  }, []);

  const selectedField = fields.find(f => f.id === selectedFieldId) || fields[0];

  const tools = [
    {
      id: 'satellite',
      title: 'Satellite Health',
      subtitle: 'Crop Vegetation & NDVI',
      purpose: 'Check field canopy health & NDVI vegetative growth.',
      route: '/build-ai/satellite',
      icon: 'satellite_alt',
      image: '/images/tools/satellite.jpg',
      badge: '10m Orbit Data'
    },
    {
      id: 'soil',
      title: 'Soil Health',
      subtitle: 'Nutrients & Carbon',
      purpose: 'Analyze NPK, pH & organic carbon with improvement steps.',
      route: '/build-ai/soil-health',
      icon: 'potted_plant',
      image: '/images/tools/soil.jpg',
      badge: 'Lab Diagnostics'
    },
    {
      id: 'regenerative',
      title: 'Regenerative AI',
      subtitle: 'Action Recommendations',
      purpose: 'Get field actions combining soil, satellite and crop data.',
      route: '/build-ai/regenerative-ai',
      icon: 'psychology',
      image: '/images/tools/regenerative.jpg',
      badge: 'AI Engine'
    },
    {
      id: 'brics',
      title: 'BRICS Knowledge',
      subtitle: 'Global Farming Practices',
      purpose: 'Explore sustainable methods from BRICS agricultural studies.',
      route: '/build-ai/brics-hub',
      icon: 'public',
      image: '/images/tools/brics.jpg',
      badge: '5 Nations'
    }
  ];

  return (
    <BuildAiShell activeRoute="/build-ai" pageTitle="Regenerative Intelligence">
      {/* Product Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
        border: '1.5px solid #BBF7D0',
        borderRadius: '16px',
        padding: '0.9rem 1.1rem',
        marginBottom: '1rem',
        boxShadow: '0 2px 8px rgba(22, 163, 74, 0.05)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: '#DCFCE7',
          color: '#15803D',
          padding: '0.2rem 0.55rem',
          borderRadius: '9999px',
          fontSize: '0.72rem',
          fontWeight: 800,
          marginBottom: '0.35rem'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>eco</span>
          <span>AgriN & Regenerative Intelligence</span>
        </div>

        <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          BharatFarm Regenerative Intelligence
        </h1>

        <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.4, fontWeight: 500 }}>
          Turn field, satellite and soil data into practical regenerative farming decisions.
        </p>
      </div>

      {/* Field / Farm Context Section */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        padding: '0.8rem 1rem',
        marginBottom: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.65rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: '1 1 240px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#F0FDF4',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>pin_drop</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Field Context
            </div>
            {isLoadingFields ? (
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Loading field profile...</div>
            ) : fields.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.15rem' }}>
                <select
                  value={selectedFieldId}
                  onChange={(e) => setSelectedFieldId(e.target.value)}
                  style={{
                    background: '#F8FAFC',
                    color: '#0F172A',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.25rem 0.55rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer',
                    maxWidth: '100%'
                  }}
                >
                  {fields.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.field_name} ({f.crop_name} • {f.area_acres} ac)
                    </option>
                  ))}
                </select>
                {selectedField && (
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                    {selectedField.centroid_lat?.toFixed(4)}°N, {selectedField.centroid_lng?.toFixed(4)}°E
                  </span>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                No saved fields yet.
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate('/sih/field-mapping')}
          style={{
            padding: '0.4rem 0.75rem',
            background: '#F8FAFC',
            color: '#15803D',
            border: '1.5px solid #BBF7D0',
            borderRadius: '8px',
            fontSize: '0.76rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            whiteSpace: 'nowrap'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>map</span>
          <span>Field Mapping</span>
        </button>
      </div>

      {/* Connected Tools Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="material-symbols-outlined" style={{ color: '#16A34A', fontSize: '18px' }}>hub</span>
          <span>Integrated Tools</span>
        </h2>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803D', background: '#DCFCE7', padding: '0.15rem 0.55rem', borderRadius: '10px' }}>
          4 Connected Capabilities
        </span>
      </div>

      {/* Compact 4-Card Responsive Grid with Visual Image Thumbnails */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '0.75rem'
      }}>
        {tools.map((card) => (
          <div
            key={card.id}
            onClick={() => navigate(card.route)}
            style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              border: '1.5px solid #E2E8F0',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease'
            }}
          >
            {/* Image Header with Badge */}
            <div style={{ position: 'relative', width: '100%', height: '110px', overflow: 'hidden', background: '#E2E8F0' }}>
              <img
                src={card.image}
                alt={card.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(4px)',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '9999px',
                letterSpacing: '0.02em'
              }}>
                {card.badge}
              </div>
            </div>

            {/* Content Body */}
            <div style={{ padding: '0.85rem 1rem 0.75rem 1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{card.icon}</span>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                      {card.title}
                    </h3>
                    <div style={{ fontSize: '0.7rem', color: '#15803D', fontWeight: 700 }}>
                      {card.subtitle}
                    </div>
                  </div>
                </div>

                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#475569', lineHeight: 1.4, fontWeight: 500 }}>
                  {card.purpose}
                </p>
              </div>

              {/* Action Button */}
              <div style={{
                marginTop: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#15803D',
                fontSize: '0.8rem',
                fontWeight: 800,
                borderTop: '1px solid #F1F5F9',
                paddingTop: '0.5rem'
              }}>
                <span>Explore Tool</span>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BuildAiShell>
  );
};
