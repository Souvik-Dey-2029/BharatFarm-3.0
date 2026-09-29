import React from 'react';

interface ContextGatheringBarProps {
  availableFields: Array<{ id: string; field_name: string; crop_name: string }>;
  selectedFieldId: string;
  onSelectField: (id: string) => void;
  includeSoil: boolean;
  onToggleSoil: (val: boolean) => void;
  includeSatellite: boolean;
  onToggleSatellite: (val: boolean) => void;
  onRefresh: () => void;
  isGenerating: boolean;
}

export const ContextGatheringBar: React.FC<ContextGatheringBarProps> = ({
  availableFields,
  selectedFieldId,
  onSelectField,
  includeSoil,
  onToggleSoil,
  includeSatellite,
  onToggleSatellite,
  onRefresh,
  isGenerating
}) => {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '1.25rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      marginBottom: '1.5rem'
    }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="material-symbols-outlined" style={{ color: '#16A34A', fontSize: '18px' }}>hub</span>
          <span>Multi-Source Context Pipeline</span>
        </span>
        <button
          onClick={onRefresh}
          disabled={isGenerating}
          style={{
            padding: '4px 12px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 700,
            border: 'none',
            background: '#F0FDF4',
            color: '#16A34A',
            cursor: isGenerating ? 'not-allowed' : 'pointer'
          }}
        >
          {isGenerating ? 'Synthesizing...' : '🔄 Re-analyze'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem'
      }}>
        {/* Field Selector */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.6rem 0.75rem' }}>
          <div style={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem' }}>FIELD CONTEXT</div>
          <select
            value={selectedFieldId}
            onChange={(e) => onSelectField(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              color: '#0F172A',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {availableFields.map(f => (
              <option key={f.id} value={f.id}>{f.field_name}</option>
            ))}
          </select>
        </div>

        {/* Soil Checkbox */}
        <div
          onClick={() => onToggleSoil(!includeSoil)}
          style={{
            background: includeSoil ? '#F0FDF4' : '#FFFBEB',
            border: `1px solid ${includeSoil ? '#BBF7D0' : '#FDE68A'}`,
            borderRadius: '10px',
            padding: '0.6rem 0.75rem',
            cursor: 'pointer'
          }}
        >
          <div style={{ color: includeSoil ? '#15803D' : '#B45309', fontWeight: 700, fontSize: '0.78rem' }}>🧪 Soil Health Data</div>
          <div style={{ color: '#64748B', fontSize: '0.72rem' }}>
            {includeSoil ? 'Connected • NPK / pH / OC' : 'Disabled (Click to enable)'}
          </div>
        </div>

        {/* Satellite Checkbox */}
        <div
          onClick={() => onToggleSatellite(!includeSatellite)}
          style={{
            background: includeSatellite ? '#F0FDF4' : '#FFFBEB',
            border: `1px solid ${includeSatellite ? '#BBF7D0' : '#FDE68A'}`,
            borderRadius: '10px',
            padding: '0.6rem 0.75rem',
            cursor: 'pointer'
          }}
        >
          <div style={{ color: includeSatellite ? '#15803D' : '#B45309', fontWeight: 700, fontSize: '0.78rem' }}>🛰️ Satellite Telemetry</div>
          <div style={{ color: '#64748B', fontSize: '0.72rem' }}>
            {includeSatellite ? 'Connected • Sentinel NDVI' : 'Disabled (Click to enable)'}
          </div>
        </div>
      </div>
    </div>
  );
};
