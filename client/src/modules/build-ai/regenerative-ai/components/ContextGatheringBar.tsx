import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext.js';

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
  const { t } = useLanguage();

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '14px',
      padding: '0.75rem 0.85rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      marginBottom: '0.85rem'
    }}>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 800,
        color: '#0F172A',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.4rem'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#15803D' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>hub</span>
          <span>{t('buildAi.availableData')}</span>
        </span>
        <button
          onClick={onRefresh}
          disabled={isGenerating}
          style={{
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 800,
            border: 'none',
            background: '#F0FDF4',
            color: '#16A34A',
            cursor: isGenerating ? 'not-allowed' : 'pointer'
          }}
        >
          {isGenerating ? '...' : `🔄 ${t('weatherPage.refreshBtn')}`}
        </button>
      </div>

      {/* Very Compact Visual Row: 🛰️ Satellite ✓ | 🧪 Soil ✓ | 🌾 Crop ✓ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.4rem'
      }}>
        {/* Satellite Checkbox */}
        <div
          onClick={() => onToggleSatellite(!includeSatellite)}
          style={{
            background: includeSatellite ? '#F0FDF4' : '#F8FAFC',
            border: `1.5px solid ${includeSatellite ? '#BBF7D0' : '#E2E8F0'}`,
            borderRadius: '8px',
            padding: '0.45rem 0.5rem',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          <div style={{ color: includeSatellite ? '#15803D' : '#64748B', fontWeight: 800, fontSize: '0.74rem' }}>
            🛰️ {t('buildAi.connectedSatellite')}
          </div>
        </div>

        {/* Soil Checkbox */}
        <div
          onClick={() => onToggleSoil(!includeSoil)}
          style={{
            background: includeSoil ? '#F0FDF4' : '#F8FAFC',
            border: `1.5px solid ${includeSoil ? '#BBF7D0' : '#E2E8F0'}`,
            borderRadius: '8px',
            padding: '0.45rem 0.5rem',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          <div style={{ color: includeSoil ? '#15803D' : '#64748B', fontWeight: 800, fontSize: '0.74rem' }}>
            🧪 {t('buildAi.connectedSoil')}
          </div>
        </div>

        {/* Crop Context */}
        <div
          style={{
            background: '#F0FDF4',
            border: '1.5px solid #BBF7D0',
            borderRadius: '8px',
            padding: '0.45rem 0.5rem',
            textAlign: 'center'
          }}
        >
          <div style={{ color: '#15803D', fontWeight: 800, fontSize: '0.74rem' }}>
            🌾 {t('buildAi.connectedCrop')}
          </div>
        </div>
      </div>
    </div>
  );
};
