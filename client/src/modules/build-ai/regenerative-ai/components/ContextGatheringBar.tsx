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
  onOpenWhyModal?: () => void;
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
  isGenerating,
  onOpenWhyModal
}) => {
  const { t } = useLanguage();

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '14px',
      padding: '0.75rem 0.85rem',
      border: '1.5px solid #EFEAE2',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      marginBottom: '0.75rem'
    }}>
      {/* Visual Signals Row: Satellite ✓ | Soil ✓ | Crop ✓ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.4rem',
        marginBottom: '0.45rem'
      }}>
        {/* Satellite Checkbox */}
        <div
          onClick={() => onToggleSatellite(!includeSatellite)}
          style={{
            background: includeSatellite ? '#F0FDF4' : '#FDFBF7',
            border: `1.5px solid ${includeSatellite ? '#BBF7D0' : '#EFEAE2'}`,
            borderRadius: '8px',
            padding: '0.4rem 0.45rem',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          <div style={{ color: includeSatellite ? '#15803D' : '#64748B', fontWeight: 800, fontSize: '0.72rem' }}>
            {t('buildAi.regenerative.contextSatellite')}
          </div>
        </div>

        {/* Soil Checkbox */}
        <div
          onClick={() => onToggleSoil(!includeSoil)}
          style={{
            background: includeSoil ? '#F0FDF4' : '#FDFBF7',
            border: `1.5px solid ${includeSoil ? '#BBF7D0' : '#EFEAE2'}`,
            borderRadius: '8px',
            padding: '0.4rem 0.45rem',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          <div style={{ color: includeSoil ? '#15803D' : '#64748B', fontWeight: 800, fontSize: '0.72rem' }}>
            {t('buildAi.regenerative.contextSoil')}
          </div>
        </div>

        {/* Crop Context */}
        <div
          style={{
            background: '#F0FDF4',
            border: '1.5px solid #BBF7D0',
            borderRadius: '8px',
            padding: '0.4rem 0.45rem',
            textAlign: 'center'
          }}
        >
          <div style={{ color: '#15803D', fontWeight: 800, fontSize: '0.72rem' }}>
            {t('buildAi.regenerative.contextCrop')}
          </div>
        </div>
      </div>

      {/* Trust Line */}
      <div
        onClick={onOpenWhyModal}
        style={{
          fontSize: '0.72rem',
          color: onOpenWhyModal ? '#15803D' : '#64748B',
          textAlign: 'center',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.35rem',
          cursor: onOpenWhyModal ? 'pointer' : 'default',
          padding: '0.2rem',
          borderRadius: '6px',
          transition: 'background 0.15s ease'
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#16A34A' }}>verified</span>
        <span style={{ textDecoration: onOpenWhyModal ? 'underline' : 'none' }}>
          {t('buildAi.regenerative.combinedSignals')}
        </span>
        {onOpenWhyModal && (
          <span style={{ fontSize: '0.65rem', background: '#DCFCE7', color: '#15803D', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
            {t('buildAi.whyQuestion')}
          </span>
        )}
      </div>
    </div>
  );
};
