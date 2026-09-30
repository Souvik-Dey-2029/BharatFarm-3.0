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
      purpose: 'Check crop vegetation with 10m NDVI telemetry & field canopy observation maps.',
      route: '/build-ai/satellite',
      icon: 'satellite_alt'
    },
    {
      id: 'soil',
      title: 'Soil Health',
      purpose: 'Understand your soil nutrients (NPK, pH & Organic Carbon) and improvement priorities.',
      route: '/build-ai/soil-health',
      icon: 'potted_plant'
    },
    {
      id: 'regenerative',
      title: 'Regenerative AI',
      purpose: 'Get structured farming recommendations synthesizing soil, satellite, and crop context.',
      route: '/build-ai/regenerative-ai',
      icon: 'eco'
    },
    {
      id: 'brics',
      title: 'BRICS Knowledge',
      purpose: 'Learn sustainable farming practices and field research from BRICS agricultural contexts.',
      route: '/build-ai/brics-hub',
      icon: 'public'
    }
  ];

  return (
    <BuildAiShell activeRoute="/build-ai" pageTitle="Regenerative Intelligence">
      {/* Product Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
        border: '1.5px solid #BBF7D0',
        borderRadius: '18px',
        padding: '1.25rem 1.25rem',
        marginBottom: '1.25rem',
        boxShadow: '0 2px 8px rgba(22, 163, 74, 0.05)'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: '#DCFCE7',
            color: '#15803D',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 800,
            marginBottom: '0.5rem'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>eco</span>
            <span>AgriN & Regenerative Agricultural Intelligence</span>
          </div>

          <h1 style={{ margin: '0 0 0.4rem 0', fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            BharatFarm Regenerative Intelligence
          </h1>

          <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, fontWeight: 500 }}>
            Turn field, satellite and soil data into practical regenerative farming decisions.
          </p>
        </div>
      </div>

      {/* Field / Farm Context Section */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        padding: '1rem',
        marginBottom: '1.25rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 260px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#F0FDF4',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>pin_drop</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Field Context
            </div>
            {isLoadingFields ? (
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Loading field profile...</div>
            ) : fields.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                <select
                  value={selectedFieldId}
                  onChange={(e) => setSelectedFieldId(e.target.value)}
                  style={{
                    background: '#F8FAFC',
                    color: '#0F172A',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.84rem',
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
                  <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                    {selectedField.centroid_lat?.toFixed(4)}°N, {selectedField.centroid_lng?.toFixed(4)}°E
                  </span>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                No saved fields yet.
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate('/sih/field-mapping')}
          style={{
            padding: '0.45rem 0.85rem',
            background: '#F8FAFC',
            color: '#15803D',
            border: '1.5px solid #BBF7D0',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            whiteSpace: 'nowrap'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>map</span>
          <span>Field Mapping</span>
        </button>
      </div>

      {/* Connected Tools Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="material-symbols-outlined" style={{ color: '#16A34A', fontSize: '20px' }}>hub</span>
          <span>Integrated Tools</span>
        </h2>
        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#15803D', background: '#DCFCE7', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
          4 Connected Capabilities
        </span>
      </div>

      {/* Compact 4-Card Responsive Grid (1-col on mobile, 2-col on tablet/desktop) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '0.85rem'
      }}>
        {tools.map((card) => (
          <div
            key={card.id}
            onClick={() => navigate(card.route)}
            style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              border: '1.5px solid #E2E8F0',
              padding: '1.1rem 1.15rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{card.icon}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: '#0F172A' }}>
                  {card.title}
                </h3>
              </div>

              <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, fontWeight: 500 }}>
                {card.purpose}
              </p>
            </div>

            <div style={{
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#15803D',
              fontSize: '0.82rem',
              fontWeight: 800,
              borderTop: '1px solid #F1F5F9',
              paddingTop: '0.65rem'
            }}>
              <span>Open Tool</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </div>
          </div>
        ))}
      </div>
    </BuildAiShell>
  );
};
