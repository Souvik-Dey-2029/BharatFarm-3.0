import React from 'react';
import { BricsCountryCode, BricsTopicCategory, BricsQueryFilters } from '../types.js';
import { useLanguage } from '../../../../context/LanguageContext.js';

interface Props {
  filters: BricsQueryFilters;
  onChange: (updated: BricsQueryFilters) => void;
  viewMode: 'grid' | 'comparison';
  onToggleViewMode: (mode: 'grid' | 'comparison') => void;
}

const COUNTRIES: { code: BricsCountryCode | 'ALL'; flag: string; label: string }[] = [
  { code: 'ALL', flag: '🌍', label: 'All BRICS' },
  { code: 'IN', flag: '🇮🇳', label: 'India' },
  { code: 'BR', flag: '🇧🇷', label: 'Brazil' },
  { code: 'RU', flag: '🇷🇺', label: 'Russia' },
  { code: 'CN', flag: '🇨🇳', label: 'China' },
  { code: 'ZA', flag: '🇿🇦', label: 'South Africa' }
];

export const BricsFilterBar: React.FC<Props> = ({
  filters,
  onChange,
  viewMode,
  onToggleViewMode
}) => {
  const { t } = useLanguage();

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1.5px solid #EFEAE2',
      borderRadius: '14px',
      padding: '0.75rem 0.85rem',
      marginBottom: '0.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.65rem'
    }}>
      {/* Top Search & View Mode Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ flex: '1 1 180px' }}>
          <input
            type="text"
            placeholder={t('buildAi.searchPractices')}
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            style={{
              width: '100%',
              background: '#F8FAFC',
              border: '1.5px solid #CBD5E1',
              borderRadius: '8px',
              padding: '0.4rem 0.65rem',
              color: '#0F172A',
              fontSize: '0.82rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* View mode toggle */}
        <div style={{
          display: 'flex',
          background: '#F1F5F9',
          borderRadius: '8px',
          padding: '2px',
          border: '1px solid #E2E8F0'
        }}>
          <button
            onClick={() => onToggleViewMode('grid')}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'grid' ? '#15803D' : '#64748B',
              fontWeight: 800,
              fontSize: '0.74rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            {t('buildAi.practiceCardBtn')}
          </button>
          <button
            onClick={() => onToggleViewMode('comparison')}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'comparison' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'comparison' ? '#15803D' : '#64748B',
              fontWeight: 800,
              fontSize: '0.74rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'comparison' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            {t('buildAi.compareBtn')}
          </button>
        </div>
      </div>

      {/* 2-Column Compact Dropdowns on Mobile: [ Country ▼ ] & [ Crop ▼ ] */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.55rem'
      }}>
        {/* Country Dropdown */}
        <div>
          <label style={{ display: 'block', fontSize: '0.68rem', color: '#64748B', fontWeight: 800, marginBottom: '2px' }}>
            {t('buildAi.bricsFilterCountry')}
          </label>
          <select
            value={filters.country || 'ALL'}
            onChange={(e) => onChange({ ...filters, country: e.target.value as any })}
            style={{
              width: '100%',
              background: '#F8FAFC',
              border: '1.5px solid #CBD5E1',
              borderRadius: '8px',
              padding: '0.35rem 0.55rem',
              color: '#0F172A',
              fontSize: '0.8rem',
              fontWeight: 700,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Crop Dropdown */}
        <div>
          <label style={{ display: 'block', fontSize: '0.68rem', color: '#64748B', fontWeight: 800, marginBottom: '2px' }}>
            {t('buildAi.bricsFilterCrop')}
          </label>
          <select
            value={filters.crop || 'ALL'}
            onChange={(e) => onChange({ ...filters, crop: e.target.value })}
            style={{
              width: '100%',
              background: '#F8FAFC',
              border: '1.5px solid #CBD5E1',
              borderRadius: '8px',
              padding: '0.35rem 0.55rem',
              color: '#0F172A',
              fontSize: '0.8rem',
              fontWeight: 700,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          >
            <option value="ALL">{t('buildAi.allCrops')}</option>
            <option value="Rice">Rice (Paddy)</option>
            <option value="Wheat">Wheat</option>
            <option value="Soybean">Soybean</option>
            <option value="Corn">Corn (Maize)</option>
            <option value="Cotton">Cotton</option>
          </select>
        </div>
      </div>
    </div>
  );
};
